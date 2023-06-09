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

export default async function middleware(req) {
  const { content } = await fetchRedirects();

  // convert array to object for faster lookup
  const redirects = content.reduce(
    (acc, { fromPath, toPath }) => ({ ...acc, [fromPath]: toPath }),
    {},
  );

  if (redirects.hasOwnProperty(req.nextUrl.pathname)) {
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
}
