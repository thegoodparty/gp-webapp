import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

export async function fetchUserCampaignOld() {
  try {
    const api = gpApi.campaign.onboarding.get;
    const token = getServerToken();
    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export async function fetchUserCampaign() {
  try {
    const resp = await serverFetch(apiRoutes.campaign.get);
    return resp.data;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default async function getCampaign(params) {
  const { slug } = params;
  const campaign = await fetchUserCampaign();

  if (campaign?.slug !== slug) {
    redirect('/run-for-office');
  }
  return campaign;
}
