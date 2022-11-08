const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true, transpilePackages: ['ui'] },
  images: {
    domains: ['assets.goodparty.org', 'images.ctfassets.net'],
  },
};

module.exports = withPWA(nextConfig);
