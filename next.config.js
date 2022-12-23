const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  transpilePackages: ['ui'],
  images: {
    domains: ['assets.goodparty.org', 'images.ctfassets.net'],
  },
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  },
};

module.exports = withPWA(nextConfig);
