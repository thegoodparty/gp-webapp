'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { generateCampaignStatus } from '../[slug]/dashboard/campaignSteps';

export async function updateCampaign(campaign, versionKey, updateCandidate) {
  try {
    const api = gpApi.campaign.onboarding.update;
    const currentStep = calcCampaignStep(campaign);
    const payload = {
      campaign: {
        ...campaign,
        currentStep,
      },
      versionKey,
      updateCandidate,
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

function calcCampaignStep(campaign) {
  const status = generateCampaignStatus(campaign);
  return status.currentStep;
}
