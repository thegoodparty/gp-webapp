import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';

export async function fetchCampaignStatus() {
  try {
    const api = gpApi.user.campaignStatus;
    const token = getServerToken();
    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error at fetchCampaignStatus', e);
    return { status: false };
  }
}

export default async function candidateAccess() {
  const token = getServerToken();
  const campaignStatus = await fetchCampaignStatus();
  if (!campaignStatus || campaignStatus.status !== 'candidate') {
    redirect('/');
  }
}
