import { NextResponse } from 'next/server';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export const fetchRedirects = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'redirects',
  };
  return await gpFetch(api, payload, 3600);
};

let dbRedirects;
let dbFetchTime;

const redirects = {
  '/elections/senate/me': '/',
  '/candidates': '/elections-results/nashville',
  '/nashville': '/elections-results/nashville',
  '/northcarolina': '/elections-results/nc',
  '/nc': '/elections-results/nc',
  '/run': '/run-for-office',
  '/pricing': '/run-for-office#pricing-section',
};

const absoluteRedirects = {
  '/iva': 'https://lp.goodparty.org/iva',
};

// const blockedIPs = ['142.198.200.33'];

export default async function middleware(req) {
  // only call dbRedirect if it is not defined or once an hour
  if (!dbRedirects) {
    if (!dbFetchTime || Date.now() - dbFetchTime > 3600000) {
      dbFetchTime = Date.now();
      const res = await fetchRedirects();
      dbRedirects = res.content;
      // dbRedirects is an array of object like this: { pathname: 'aa', redirectUrl: 'https://www.google.com' }
      // we need to convert it to an object
      if (dbRedirects) {
        dbRedirects = dbRedirects.reduce((acc, item) => {
          acc[`/${item.pathname}`] = item.redirectUrl;
          return acc;
        }, {});
      }
    }
  }

  // const forwarded = req.headers.get('x-forwarded-for');
  // const ip = forwarded ? forwarded.split(',')[0] : req.ip;
  // if (blockedIPs.includes(ip)) {
  //   return NextResponse.redirect(
  //     `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
  //     { status: 301 },
  //   );
  // }
  const { pathname } = req.nextUrl;

  if (redirects[pathname]) {
    return NextResponse.redirect(
      `${req.nextUrl.origin}${redirects[pathname]}${req.nextUrl.search || ''}`,
      { status: 301 },
    );
  }

  if (absoluteRedirects[pathname]) {
    return NextResponse.redirect(
      `${absoluteRedirects[pathname]}${req.nextUrl.search || ''}`,
      { status: 301 },
    );
  }
  if (dbRedirects && dbRedirects[pathname]) {
    return NextResponse.redirect(
      `${dbRedirects[pathname]}${req.nextUrl.search || ''}`,
      { status: 301 },
    );
  }

  if (pathname === pathname.toLowerCase()) {
    return NextResponse.next();
  }

  return NextResponse.redirect(
    `${req.nextUrl.origin + pathname.toLowerCase()}`,
    { status: 301 },
  );

  // if we ever want to have images or static assets with capital letters we need this:
  // export const config = {
  //   matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
  // }
}
