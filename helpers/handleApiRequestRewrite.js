import { NextResponse } from 'next/server';

const apiRootUrl = new URL(
  process.env.NEXT_PUBLIC_API_BASE || 'https://api-dev.goodparty.org',
);

const apiRewriteUrl = (ReqNextUrl) => {
  const newUrl = ReqNextUrl.clone();
  newUrl.protocol = apiRootUrl.protocol;
  newUrl.host = apiRootUrl.host;
  newUrl.pathname = ReqNextUrl.pathname;
  newUrl.search = ReqNextUrl.search;
  return newUrl.toString();
};

export const handleApiRequestRewrite = async (req) => {
  const { value: impersonateToken } = req.cookies.get('impersonateToken') || {};
  const { value: token } = req.cookies.get('token') || {};

  (impersonateToken || token) &&
    req.headers.set('Authorization', `Bearer ${impersonateToken || token}`);

  console.info(`req.nextUrl =>`, req.nextUrl);
  return NextResponse.rewrite(apiRewriteUrl(req.nextUrl), {
    request: req,
  });
};
