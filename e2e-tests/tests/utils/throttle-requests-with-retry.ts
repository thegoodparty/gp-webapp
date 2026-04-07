import Bottleneck from 'bottleneck'

type ThrottleConfig = {
  rateLimit: number
  windowMs: number
  workerCount?: number
  safetyFactor?: number
  maxRetries?: number
  label?: string
}

type RateLimitError = Error & { status?: number; retryAfter?: number }

const is429 = (error: RateLimitError): boolean =>
  error.status === 429 || error.message.includes('Too Many Requests')

export const throttleRequestsWithRetry = (
  config: ThrottleConfig,
): (<T>(fn: () => Promise<T>, weight?: number) => Promise<T>) => {
  const {
    rateLimit,
    windowMs,
    workerCount = 1,
    safetyFactor = 0.5,
    maxRetries = 3,
    label = 'throttle',
  } = config

  const perWorkerLimit = Math.floor((rateLimit * safetyFactor) / workerCount)
  const minTimeMs = Math.ceil(windowMs / perWorkerLimit)

  const limiter = new Bottleneck({
    reservoir: perWorkerLimit,
    reservoirRefreshAmount: perWorkerLimit,
    reservoirRefreshInterval: windowMs,
    maxConcurrent: null,
    minTime: minTimeMs,
  })

  limiter.on(
    'failed',
    async (error: RateLimitError, jobInfo): Promise<number | void> => {
      if (jobInfo.retryCount < maxRetries && is429(error)) {
        const retryAfter = error.retryAfter || 1
        const waitMs = retryAfter * 1000
        console.log(
          `[${label}] 429 hit — attempt ` +
            `${jobInfo.retryCount + 1}/${maxRetries}, ` +
            `waiting ${retryAfter}s`,
        )
        return waitMs
      }

      return undefined
    },
  )

  return <T>(fn: () => Promise<T>, weight?: number): Promise<T> =>
    limiter.schedule({ weight: weight ?? 1 }, fn)
}

// https://clerk.com/docs/guides/how-clerk-works/system-limits#backend-api-requests
const CLERK_DEV_RATE_LIMIT = 100
const CLERK_RATE_WINDOW_MS = 10_000

// playwright.config.ts runs 4 fully-parallel workers (separate processes).
// Each shares the same Clerk secret key, so the 100-req/10s budget is global.
// Dividing by worker count with a 50% safety margin absorbs:
//   - sliding-window vs fixed-refresh misalignment
//   - cross-process timing jitter
//   - leftover budget from a previous test run
export const clerkThrottle = throttleRequestsWithRetry({
  rateLimit: CLERK_DEV_RATE_LIMIT,
  windowMs: CLERK_RATE_WINDOW_MS,
  workerCount: 4,
  safetyFactor: 0.25,
  maxRetries: 3,
  label: 'clerk-limiter',
})
