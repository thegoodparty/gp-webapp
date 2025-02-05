'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { deleteCookie, getCookie } from 'helpers/cookieHelper';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export async function updateCampaign(attr, slug) {
  try {
    if (!Array.isArray(attr) && typeof attr === 'object') {
      attr = [attr];
    }

    const payload = {
      attr,
      slug, // admin only
    };
    const resp = await clientFetch(apiRoutes.campaign.update, payload);
    return resp.data;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function getCampaign() {
  try {
    const resp = await clientFetch(apiRoutes.campaign.get);
    return resp.data;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function fetchCampaignVersions() {
  try {
    const resp = await clientFetch(apiRoutes.campaign.planVersion);
    return resp.data;
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

export async function createDemoCampaign() {
  try {
    const api = gpApi.campaign.createDemoCampaign;
    const { slug } = await gpFetch(api);
    if (slug) {
      deleteCookie('afterAction');
      deleteCookie('returnUrl');
    }
  } catch (e) {
    return false;
  }
}

export async function createCampaign() {
  try {
    const resp = await clientFetch(apiRoutes.campaign.create);
    const { slug } = resp.data;

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
    const resp = await clientFetch(apiRoutes.user.updateMeta, { meta });
    return resp.data;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}
