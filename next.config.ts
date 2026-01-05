import type { NextConfig } from 'next'
import { newRelicSourceMapPlugin } from 'utils/upload-sourcemaps'

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

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
  webpack: (config, { isServer }) => {
    // Only upload sourcemaps on the client build (not server)
    // and only in production builds
    if (!isServer && process.env.NODE_ENV === 'production') {
      config.plugins.push(newRelicSourceMapPlugin)
    }
    return config
  },
}

export default withPWA(nextConfig)
