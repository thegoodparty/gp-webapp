import { NextResponse } from 'next/server';

export const handlePathRedirect = (req, redirectPaths) => {
  const url = redirectPaths[req.nextUrl.pathname];
  if (url.startsWith('http')) {
    return NextResponse.redirect(`${url}${req.nextUrl.search || ''}`, {
      status: 301,
    });
  }
  return NextResponse.redirect(
    `${req.nextUrl.origin}${url}${req.nextUrl.search || ''}`,
    { status: 301 },
  );
};
