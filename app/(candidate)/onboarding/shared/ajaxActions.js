'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { deleteCookie, getCookie } from 'helpers/cookieHelper';

export async function updateCampaign(attr, slug) {
  try {
    if (!Array.isArray(attr) && typeof attr === 'object') {
      attr = [attr];
    }
    const api = gpApi.campaign.update;
    const payload = {
      attr,
      slug, // admin only
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function getCampaign() {
  try {
    const api = gpApi.campaign.get;
    return await gpFetch(api);
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

export function onboardingStep(campaign, step) {
  const numericStep = campaign?.currentStep
    ? `${campaign.currentStep}`.replace(/\D/g, '')
    : 0;
  const nextStep = Math.max(numericStep, step);
  return `onboarding-${nextStep}`;
}

export async function createCampaign() {
  try {
    const api = gpApi.campaign.create;
    const { slug } = await gpFetch(api);
    if (slug) {
      deleteCookie('afterAction');
      deleteCookie('returnUrl');

      // claim profile from candidate page. save it to the new campaign
      const claimProfile = getCookie('claimProfile');
      if (claimProfile) {
        await updateCampaign([
          { key: 'data.claimProfile', value: claimProfile },
        ]);
        deleteCookie('claimProfile');
      }
      window.location.href = `/onboarding/${slug}/1`;
    }
  } catch (e) {
    return false;
  }
}

export async function updateUserMeta(meta) {
  try {
    const api = gpApi.user.updateMeta;
    return await gpFetch(api, { meta });
  } catch (e) {
    console.log('error', e);
    return false;
  }
}
