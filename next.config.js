const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  images: {
    domains: ['assets.goodparty.org', 'images.ctfassets.net'],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'assets.goodparty.org',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'images.ctfassets.net',
    //   },
    // ],
  },
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ];
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/candidate/:slug/:id',
  //       destination: '/candidate/:slug',
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = withPWA(nextConfig);
