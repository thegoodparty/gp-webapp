import { NextResponse } from 'next/server';
import { handleApiRequestRewrite } from 'helpers/handleApiRequestRewrite';

import { API_VERSION_PREFIX } from 'appEnv';

const dbRedirects = {
  '/social': 'https://shor.by/goodpartyorg',
  '/pricing': '/run-for-office#pricing-section',
  '/iva': 'https://lp.goodparty.org/iva',
  '/aa':
    'https://goodparty.org/candidates/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_oct_1_aa_find_candidates_optin_&utm_content=optin_&',
  '/bz':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_38_bz_stickers_qr_ambassador_7_&utm_content=ambassador_7_&',
  '/bx':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_37_bx_stickers_qr_ambassador_6_&utm_content=ambassador_6_&',
  '/bw':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_36_bw_stickers_qr_ambassador_5_&utm_content=ambassador_5_&',
  '/bv':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_35_bv_stickers_qr_ambassador_4_&utm_content=ambassador_4_&',
  '/bu':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_34_bu_stickers_qr_ambassador_3_&utm_content=ambassador_3_&',
  '/bt':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_33_bt_stickers_qr_ambassador_2_&utm_content=ambassador_2_&',
  '/br':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_32_br_stickers_qr_ambassador_1_&utm_content=ambassador_1_&',
  '/bq':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_31_bq_stickers_qr_interns_&utm_content=interns_&',
  '/bp':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_30_bp_stickers_qr_mob_intern_6_&utm_content=mob_intern_6_&',
  '/bn':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_29_bn_stickers_qr_mob_intern_5_&utm_content=mob_intern_5_&',
  '/bm':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_28_bm_stickers_qr_mob_intern_4_&utm_content=mob_intern_4_&',
  '/bl':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_27_bl_stickers_qr_mob_intern_3_&utm_content=mob_intern_3_&',
  '/bk':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_26_bk_stickers_qr_mob_intern_2_&utm_content=mob_intern_2_&',
  '/bh':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_25_bh_stickers_qr_mob_intern_1_&utm_content=mob_intern_1_&',
  '/bg':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_24_bg_stickers_qr_partners_&utm_content=partners_&',
  '/bd':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_23_bd_stickers_qr_creator_ambassadors_&utm_content=creator_ambassadors_&',
  '/bc':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_22_bc_stickers_qr_creators_&utm_content=creators_&',
  '/ba':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_20_ba_stickers_qr_contractors_&utm_content=contractors_&',
  '/az':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_19_az_stickers_qr_volunteer_ambassadors_&utm_content=volunteer_ambassadors_&',
  '/ay':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_18_ay_stickers_qr_new_volunteers_&utm_content=new_volunteers_&',
  '/aw':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_17_aw_stickers_qr_optin_stickers_&utm_content=optin_stickers_&',
  '/av':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_16_av_stickers_qr_FT_team_&utm_content=FT_team_&',
  '/au':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_15_au_stickers_qr_David_&utm_content=David_&',
  '/ar':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_14_ar_stickers_qr_Katrina_&utm_content=Katrina_&',
  '/aq':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_13_aq_stickers_qr_Kennedy_&utm_content=Kennedy_&',
  '/ap':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_12_ap_stickers_qr_Quinn_&utm_content=Quinn_&',
  '/ao':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_11_ao_stickers_qr_Rob_&utm_content=Rob_&',
  '/am':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_10_am_stickers_qr_Martha_&utm_content=Martha_&',
  '/al':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_9_al_stickers_qr_Victoria_&utm_content=Victoria_&',
  '/ak':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_8_ak_stickers_qr_Jared_&utm_content=Jared_&',
  '/aj':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_7_aj_stickers_qr_Zak_&utm_content=Zak_&',
  '/ah':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_6_ah_stickers_qr_Farhad_&utm_content=Farhad_&',
  '/ag':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_5_ag_stickers_qr_5_&utm_content=5_&',
  '/ae':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_4_ae_stickers_qr_4_&utm_content=4_&',
  '/bb':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_21_bb_stickers_qr_candidates_&utm_content=candidates_&',
  '/ab':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_2_ab_stickers_qr_2_&utm_content=2_&',
  '/ac':
    'https://goodparty.org/get-stickers/?utm_source=mob&utm_medium=stickers&utm_campaign=2024_aug_3_ac_stickers_qr_3_&utm_content=3_&',
  '/run': '/run-for-office',
  '/elections/senate/me': '/',
};

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  // This is a workaround to pass the pathname to SSR pages
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);

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

  const apiRewriteRequest = pathname.startsWith(`/api${API_VERSION_PREFIX}`);
  if (apiRewriteRequest) {
    try {
      return await handleApiRequestRewrite(req);
    } catch (error) {
      console.error('Error in handleApiRequestRewrite', error);
      throw error;
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/:path*',
};
