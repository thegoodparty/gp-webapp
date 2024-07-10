import { NextResponse } from 'next/server';

export const handlePathRedirect = (req, redirectPaths) => {
  const url = redirectPaths[req.nextUrl.pathname];
  console.log('Redirecting to:', url);
  if (url.startsWith('http')) {
    console.log('Redirecting to external URL:', url)
    return NextResponse.redirect(`${url}${req.nextUrl.search || ''}`, {
      status: 301,
    });
  }
  return NextResponse.redirect(
    `${req.nextUrl.origin}${url}${req.nextUrl.search || ''}`,
    { status: 301 },
  );
};
