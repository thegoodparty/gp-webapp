'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function updateCampaign(campaign) {
  try {
    const api = gpApi.campaign.onboarding.update;
    return await gpFetch(api, { campaign });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}
