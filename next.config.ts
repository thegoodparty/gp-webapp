import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
}) as (config: NextConfig) => NextConfig

const nextConfig: NextConfig = {
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
    const apiBase = process.env.NEXT_PUBLIC_API_BASE
    if (!apiBase) {
      // Fail loudly at config load instead of silently proxying the public
      // PDF share endpoint to a same-host 404. Every other rewrite below is
      // independent of `apiBase`, so we list them either way and only gate
      // the briefings proxy on its presence.
      // eslint-disable-next-line no-console
      console.error(
        'next.config: NEXT_PUBLIC_API_BASE is not set — /api/v1/briefings/:uuid will not be proxied to gp-api.',
      )
    }
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
      // Public PDF share link for meeting briefings. Proxies to gp-api so the
      // shareable URL lives on the marketing domain (e.g.
      // `goodparty.org/api/v1/briefings/{uuid}`) instead of leaking the API
      // subdomain into mailto:/sms: payloads. Skipped when `apiBase` is
      // unset so we don't register a rewrite to `/v1/briefings/:uuid` on the
      // marketing host (which would 404 invisibly).
      ...(apiBase
        ? [
            {
              source: '/api/v1/briefings/:uuid',
              destination: `${apiBase}/v1/briefings/:uuid`,
            },
          ]
        : []),
    ]
  },
  productionBrowserSourceMaps: true,
  webpack: (config, { isServer }) => {
    // recharts (and its bundled d3 fork, victory-vendor) is ~250KB gzipped and
    // was being merged into a shared vendor chunk that loads on ~40 routes —
    // including many that never render a chart. Isolating it into its own
    // cache group lets webpack keep it out of those routes' initial JS; it is
    // only imported via next/dynamic, so the chunk loads on demand when a chart
    // actually mounts. This does not change behavior, only chunk boundaries.
    if (
      !isServer &&
      config.optimization &&
      typeof config.optimization.splitChunks === 'object' &&
      config.optimization.splitChunks.cacheGroups
    ) {
      config.optimization.splitChunks.cacheGroups.recharts = {
        test: /[\\/]node_modules[\\/](recharts|victory-vendor|d3-[^\\/]+|internmap|decimal\.js-light)[\\/]/,
        name: 'recharts',
        // `async` (not `all`) keeps the chunk out of initial chunk groups: it is
        // only pulled in by the async next/dynamic boundary that renders a chart,
        // so chart-free routes never download it.
        chunks: 'async',
        priority: 40,
        reuseExistingChunk: true,
      }
    }
    return config
  },
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
