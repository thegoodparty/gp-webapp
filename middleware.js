import { NextResponse } from 'next/server';
import { getRedirects } from 'helpers/getRedirects';
import { handlePathRedirect } from 'helpers/handlePathRedirect';
// import { handlePathCapitalizationRedirect } from 'helpers/handlePathCapitalizationRedirect';
import { handleApiRequestRewrite } from 'helpers/handleApiRequestRewrite';

export default async function middleware(req) {
  const redirectPaths = await getRedirects();
  const { pathname } = req.nextUrl;

  const apiRewriteRequest =
    pathname.startsWith('/api/v1') &&
    !pathname.includes('login') &&
    !pathname.includes('logout');

  if (apiRewriteRequest) {
    return await handleApiRequestRewrite(req);
  }

  if (redirectPaths && redirectPaths[pathname]) {
    return handlePathRedirect(req, redirectPaths);
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
