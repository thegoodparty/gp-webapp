import gpApi, { appBase } from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
// import { NextRequest } from 'next/server';

const now = new Date();

export default async function sitemap(a, b, c) {
  console.log('a', a);
  console.log('b', b);
  console.log('c', c);
  console.log('NextRequest', NextRequest);
  const mainSitemap = [];
  const staticUrls = [
    '/',
    '/about',
    '/run-for-office',
    '/team',
    '/login',
    '/register',
    '/faqs',
    '/privacy',
    '/work-with-us',
    '/contact',
    '/pricing',
    '/political-terms',
    '/volunteer',
    '/academy',
    '/academy-intro',
    '/info-session',
    '/academy-webinar',
    '/blog',
    '/ads2023',
    '/elections',
  ];

  staticUrls.forEach((url) => {
    mainSitemap.push({
      url: `${appBase}${url}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    });
  });
  return mainSitemap;
}
