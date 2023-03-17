import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';

export async function fetchUserCampaign() {
  try {
    const api = gpApi.campaign.onboarding.findByUser;
    const token = getServerToken();
    return await gpFetch(api, false, 1, token);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default async function getCampaign(params) {
  const { slug } = params;

  let { campaign } = await fetchUserCampaign();
  if (campaign?.slug !== slug) {
    redirect('/run-for-office');
  }
  return campaign;
}
