export const IS_PROD =
  process.env.NEXT_PUBLIC_VERCEL_TARGET_ENV === 'production'
export const IS_PREVIEW =
  process.env.NEXT_PUBLIC_VERCEL_TARGET_ENV === 'preview'
export const IS_DEV =
  process.env.NEXT_PUBLIC_VERCEL_TARGET_ENV === 'development'
export const IS_LOCAL =
  Boolean(
    typeof process !== 'undefined' &&
      process?.env?.NEXT_PUBLIC_API_BASE?.includes('localhost'),
  ) ||
  Boolean(
    typeof window !== 'undefined' && window.location.href.includes('localhost'),
  )

export const API_ROOT =
  process.env.NEXT_PUBLIC_API_BASE || 'https://gp-api-dev.goodparty.org'

export const OLD_API_ROOT =
  process.env.NEXT_PUBLIC_OLD_API_BASE || 'https://api-dev.goodparty.org'

export const ELECTION_API_ROOT =
  process.env.NEXT_PUBLIC_ELECTION_API_BASE ||
  'https://election-api-dev.goodparty.org'

export const API_VERSION_PREFIX = '/v1'

export const APP_BASE = IS_LOCAL
  ? 'http://localhost:4000'
  : `https://${
      IS_PROD
        ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
        : process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
    }`

export const NEXT_PUBLIC_SEGMENT_WRITE_KEY = IS_PROD
  ? "FkKZtkOmjiezDnlSV5aK4lE0eBDnrPTd"
  : "4qKrvy4yiQsHrVT6eTheaYrrCClLDCIN"