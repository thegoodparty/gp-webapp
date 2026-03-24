import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call -- next-pwa uses require() and has no type declarations
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
}) as (config: NextConfig) => NextConfig

const nextConfig: NextConfig = {
  // ESLint runs as a separate CI step;
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: true,
  transpilePackages: ['ui'],
  images: {
    domains: [
      'assets.goodparty.org',
      'assets-dev.goodparty.org',
      'assets-qa.goodparty.org',
      'images.ctfassets.net',
      'maps.googleapis.com',
      'assets.civicengine.com',
    ],
  },
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Document-Policy',
            value: 'js-profiling',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemaps/sitemap-index.xml',
      },
      {
        source: '/news-feed.xml',
        destination: '/api/news-feed',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ]
  },
  productionBrowserSourceMaps: true,
}

export default withSentryConfig(withPWA(nextConfig), {
  org: 'goodparty',
  project: 'gp-webapp',
  silent: !process.env.CI,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  disableLogger: true,
})
