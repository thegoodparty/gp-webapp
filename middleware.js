import { NextResponse } from 'next/server';
import { handlePathRedirect } from 'helpers/handlePathRedirect';
// import { handlePathCapitalizationRedirect } from 'helpers/handlePathCapitalizationRedirect';
import { handleApiRequestRewrite } from 'helpers/handleApiRequestRewrite';
import gpFetch from 'gpApi/gpFetch';

let dbRedirects;
let dbFetchTime;

export default async function middleware(req) {
  const redirectPaths = await getRedirects();
  const { pathname } = req.nextUrl;

  console.log('redirectPaths', redirectPaths);
  if (redirectPaths && redirectPaths[pathname]) {
    console.log('Redirecting to:', redirectPaths[pathname]);
    return handlePathRedirect(req, redirectPaths);
  }

  const apiRewriteRequest =
    pathname.startsWith('/api/v1') &&
    !pathname.includes('login') &&
    !pathname.includes('logout');

  if (apiRewriteRequest) {
    return await handleApiRequestRewrite(req);
  }

  // if (pathname !== pathname.toLowerCase()) {
  //   return handlePathCapitalizationRedirect(req);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // This ensures the middleware will run BEFORE file-path routing
};

// if we ever want to have images or static assets with capital letters we need this:
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
// }

const getRedirects = async () => {
  console.log('getRedirects');
  if (!dbRedirects) {
    console.log('getRedirects2');
    // only call dbRedirect if it is not defined or once an hour
    const res = await fetchRedirects();
    dbRedirects = res.content;
    dbFetchTime = Date.now();
    console.log('getRedirects3', res);
  } else {
    if (!dbFetchTime || Date.now() - dbFetchTime > 10 * 3600000) {
      dbFetchTime = Date.now();
      console.log('getRedirects4');
      const res = await fetchRedirects();
      console.log('getRedirects5', res);
      dbRedirects = res.content;
    }
  }
  console.log('getRedirects6', dbRedirects);
  return dbRedirects;
};

const fetchRedirects = async () => {
  try {
    const api = {
      url: `${apiBase}/api/v1/content/content-by-key`,
      method: 'GET',
    };

    console.log('fetchRedirects api', api);
    const payload = {
      key: 'redirects',
    };
    const res = await gpFetch(api, payload, 3600);
    console.log('fetchRedirects', res);
    return res;
  } catch (e) {
    console.log('fetchRedirects error', e);
    return { content: {} };
  }
};
