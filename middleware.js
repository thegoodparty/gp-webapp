import { NextResponse } from 'next/server';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

// export const fetchRedirects = async () => {
//   const api = gpApi.content.contentByKey;
//   const payload = {
//     key: 'redirects',
//   };
//   return await gpFetch(api, payload, 3600);
// };

const redirects = {
  '/elections/senate/me': '/',
  '/candidates': '/elections/nashville/2023',
  '/nashville': '/elections/nashville/2023',
};

export default async function middleware(req) {
  // const { content } = await fetchRedirects();

  if (redirects[req.nextUrl.pathname]) {
    return NextResponse.redirect(
      `${req.nextUrl.origin + redirects[req.nextUrl.pathname]}`,
      { status: 301 },
    );
  }

  if (req.nextUrl.pathname === req.nextUrl.pathname.toLowerCase()) {
    return NextResponse.next();
  }

  return NextResponse.redirect(
    `${req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()}`,
    { status: 301 },
  );

  // if we ever want to have images or static assets with capital letters we need this:
  // export const config = {
  //   matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
  // }
}
