'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function updateCampaign(campaign, versionKey) {
  try {
    const api = gpApi.campaign.onboarding.update;
    const payload = {
      campaign,
      versionKey,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function fetchCampaignVersions() {
  try {
    const api = gpApi.campaign.onboarding.planVersions;
    return await gpFetch(api);
  } catch (e) {
    console.log('error at fetchCampaignVersions', e);
    return {};
  }
}
