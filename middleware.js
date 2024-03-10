import { NextResponse } from 'next/server';
// import gpApi from 'gpApi';
// import gpFetch from 'gpApi/gpFetch';

// export const fetchRedirects = async () => {
//   const api = gpApi.content.contentByKey;
//   const payload = {
//     key: 'redirects',
//   };
//   return await gpFetch(api, payload, 3600);
// };

const redirects = {
  '/elections/senate/me': '/',
  '/candidates': '/elections-results/nashville',
  '/nashville': '/elections-results/nashville',
  '/northcarolina': '/elections-results/nc',
  '/nc': '/elections-results/nc',
  '/run': '/run-for-office',
};

const blockedIPs = ['142.198.200.33'];

export default async function middleware(req) {
  // const { content } = await fetchRedirects();
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

  // match /candidate/firstName-lastName old candidate url
  // /\/candidate\/([a-zA-Z]+)-([a-zA-Z]+)/
  const pattern = /\/candidate\/([a-zA-Z]+)-([a-zA-Z]+)/;
  const match = pathname.match(pattern);
  if (match) {
    return NextResponse.redirect(`${req.nextUrl.origin}`, { status: 301 });
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
