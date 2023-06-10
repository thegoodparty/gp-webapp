import { NextResponse } from 'next/server';

const Middleware = (req) => {
  if (req.nextUrl.pathname === req.nextUrl.pathname.toLowerCase()) {
    return NextResponse.next();
  }

  return NextResponse.redirect(
    `${req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()}`,
    { status: 301 },
  );
};

// if we ever want to have images or static assets with capital letters we need this:
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
// };

export default Middleware;
