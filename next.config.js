const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true, transpilePackages: ['ui'] },
};

module.exports = withPWA(nextConfig);
