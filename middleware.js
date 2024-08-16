import { NextResponse } from 'next/server';
import { handleApiRequestRewrite } from 'helpers/handleApiRequestRewrite';

const dbRedirects = {
  '/bb':
    'https://lp.goodparty.org/marketing/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_june_21_bb_independenceday_qr_candidates_&utm_content=candidates_&',
  '/ab':
    'https://lp.goodparty.org/marketing/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_june_2_ab_independenceday_qr_reengage_hubspot_&utm_content=reengage_hubspot_&',
  '/aa':
    'https://lp.goodparty.org/marketing/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_june_1_aa_independenceday_qr_optin_&utm_content=optin_&',
  '/iva': 'https://lp.goodparty.org/iva',
  '/pricing': '/run-for-office#pricing-section',
  '/run': '/run-for-office',
  '/elections/senate/me': '/',
};

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (dbRedirects && dbRedirects[pathname]) {
    const url = dbRedirects[pathname];
    if (url.startsWith('http')) {
      return NextResponse.redirect(`${url}${req.nextUrl.search || ''}`, {
        status: 301,
      });
    }
    return NextResponse.redirect(
      `${req.nextUrl.origin}${url}${req.nextUrl.search || ''}`,
      { status: 301 },
    );
  }

  const apiRewriteRequest =
    pathname.startsWith('/api/v1') &&
    !pathname.includes('login') &&
    !pathname.includes('register') &&
    !pathname.includes('logout');

  if (apiRewriteRequest) {
    return await handleApiRequestRewrite(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
