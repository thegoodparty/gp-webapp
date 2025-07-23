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

export const NEXT_PUBLIC_SEGMENT_WRITE_KEY =
  process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY

export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51P8p2Y1taBPnTqn4IacUdFzw2mWPe8ljraPrpMlqMxtb8h1EvYTJvdGrj3kSeRIqm2ltL8RE8bAZL3EsLqpW3VNS00VZLcvudS'

export const NEXT_PUBLIC_GOOGLE_MAPS_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
  'AIzaSyDMcCbNUtBDnVRnoLClNHQ8hVDILY52ez8'

export const NEXT_PUBLIC_CANDIDATES_SITE_BASE =
  process.env.NEXT_PUBLIC_CANDIDATES_SITE_BASE ||
  (IS_LOCAL ? 'http://localhost:4001' : 'https://candidates.goodparty.org')
