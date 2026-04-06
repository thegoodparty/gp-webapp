import Bottleneck from 'bottleneck'
import { isClerkAPIResponseError } from '@clerk/shared/error'

// https://clerk.com/docs/guides/how-clerk-works/system-limits#backend-api-requests
const CLERK_DEV_RATE_LIMIT = 100
const RATE_WINDOW_MS = 10_000

// playwright.config.ts runs 4 fully-parallel workers (separate processes).
// Each shares the same Clerk secret key, so the 100-req/10s budget is global.
// Dividing by worker count with a 50% safety margin absorbs:
//   - sliding-window vs fixed-refresh misalignment
//   - cross-process timing jitter
//   - leftover budget from a previous test run
const WORKER_COUNT = 4
const SAFETY_FACTOR = 0.5
const PER_WORKER_LIMIT = Math.floor(
  (CLERK_DEV_RATE_LIMIT * SAFETY_FACTOR) / WORKER_COUNT,
)
const MIN_TIME_MS = Math.ceil(RATE_WINDOW_MS / PER_WORKER_LIMIT)

const limiter = new Bottleneck({
  reservoir: PER_WORKER_LIMIT,
  reservoirRefreshAmount: PER_WORKER_LIMIT,
  reservoirRefreshInterval: RATE_WINDOW_MS,
  maxConcurrent: 1,
  minTime: MIN_TIME_MS,
})

const MAX_RETRIES = 3

const is429 = (error: Error): boolean =>
  (isClerkAPIResponseError(error) && error.status === 429) ||
  error.message.includes('Too Many Requests')

limiter.on('failed', async (error, jobInfo): Promise<number | void> => {
  if (jobInfo.retryCount < MAX_RETRIES && is429(error)) {
    const retryAfter = isClerkAPIResponseError(error)
      ? error.retryAfter || 1
      : 1
    const waitMs = retryAfter * 1000
    console.log(
      `[clerk-limiter] 429 hit — attempt ` +
        `${jobInfo.retryCount + 1}/${MAX_RETRIES}, ` +
        `waiting ${retryAfter}s`,
    )
    return waitMs
  }

  return undefined
})

export const clerkRetry = <T>(fn: () => Promise<T>): Promise<T> =>
  limiter.schedule(fn)
