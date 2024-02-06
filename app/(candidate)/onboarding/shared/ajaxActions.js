'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { generateCampaignStatus } from '../../onboarding-old/[slug]/dashboard/campaignSteps';

export async function updateCampaign(
  campaign,
  versionKey,
  updateCandidate,
  subSectionKey,
) {
  try {
    const api = gpApi.campaign.onboarding.update;
    // const currentStep = calcCampaignStep(campaign);
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

function calcCampaignStep(campaign) {
  const status = generateCampaignStatus(campaign);
  return status.currentStep;
}
export function onboardingStep(campaign, step) {
  const numericStep = campaign?.currentStep
    ? `${campaign.currentStep}`.replace(/\D/g, '')
    : 0;
  const nextStep = Math.max(numericStep, step);
  return `onboarding-${nextStep}`;
}
