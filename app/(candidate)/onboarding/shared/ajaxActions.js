'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { deleteCookie } from 'helpers/cookieHelper';

export async function updateCampaign(
  campaign,
  versionKey,
  updateCandidate,
  subSectionKey,
) {
  try {
    const api = gpApi.campaign.onboarding.update;
    const payload = {
      campaign: {
        ...campaign,
      },
      versionKey,
      updateCandidate,
      subSectionKey,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function getCampaign() {
  try {
    const api = gpApi.campaign.onboarding.findByUser;
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

export async function createCampaign(firstName, lastName) {
  try {
    const api = gpApi.campaign.onboarding.create;
    const payload = { firstName, lastName };
    const { slug } = await gpFetch(api, payload);
    if (slug) {
      deleteCookie('afterAction');
      deleteCookie('returnUrl');
      window.location.href = `/onboarding/${slug}/1`;
    }
  } catch (e) {
    return false;
  }
}
