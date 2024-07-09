import { NextResponse } from 'next/server';
// import { handlePathRedirect } from 'helpers/handlePathRedirect';
// import { handlePathCapitalizationRedirect } from 'helpers/handlePathCapitalizationRedirect';
import { handleApiRequestRewrite } from 'helpers/handleApiRequestRewrite';
// import gpFetch from 'gpApi/gpFetch';
// import { apiBase } from 'gpApi';

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
  // const redirectPaths = await getRedirects();
  // if (!dbRedirects) {
  //   if (!dbFetchTime || Date.now() - dbFetchTime > 3600000) {
  //     console.log(
  //       'fetching redirects ====================== dbFetchTime',
  //       dbFetchTime,
  //     );
  //     dbFetchTime = Date.now();
  //     const res = await fetchRedirects();
  //     dbRedirects = res.content;
  //   }
  // }
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

  // console.log('Middleware executed:', { pathname, redirectPaths });
  // if (redirectPaths && redirectPaths[pathname]) {
  //   console.log('Redirecting to:', redirectPaths[pathname]);
  //   return handlePathRedirect(req, redirectPaths);
  // }

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
  matcher: '/:path*',
};

// const getRedirects = async () => {
//   console.log('getRedirects');
//   if (!dbRedirects) {
//     console.log('getRedirects2: Fetching redirects for the first time');
//     const res = await fetchRedirects();
//     if (res && res.content) {
//       dbRedirects = res.content;
//       dbFetchTime = Date.now();
//       console.log('getRedirects3: Redirects fetched successfully', res);
//     } else {
//       console.error('getRedirects3: Failed to fetch redirects', res);
//     }
//   } else {
//     if (!dbFetchTime || Date.now() - dbFetchTime > 10 * 3600000) {
//       console.log('getRedirects4: Cache expired, fetching new redirects');
//       dbFetchTime = Date.now();
//       const res = await fetchRedirects();
//       if (res && res.content) {
//         dbRedirects = res.content;
//         console.log('getRedirects5: Redirects refreshed successfully', res);
//       } else {
//         console.error('getRedirects5: Failed to refresh redirects', res);
//       }
//     }
//   }
//   console.log('getRedirects6: Returning redirects', dbRedirects);
//   return dbRedirects;
// };

// const fetchRedirects = async () => {
//   try {
//     const api = {
//       url: `${apiBase}/api/v1/content/content-by-key`,
//       method: 'GET',
//     };

//     console.log('fetchRedirects api', api);
//     const payload = {
//       key: 'redirects',
//     };
//     const res = await gpFetch(api, payload, 3600);
//     console.log('fetchRedirects result', res);
//     return res;
//   } catch (e) {
//     console.error('fetchRedirects error', e);
//     return { content: {} };
//   }
// };
