import { NextResponse } from 'next/server';

export const handlePathCapitalizationRedirect = (req) => {
  const { pathname } = req.nextUrl;
  return NextResponse.redirect(
    `${req.nextUrl.origin + pathname.toLowerCase()}`,
    {
      status: 301,
    },
  );
};
