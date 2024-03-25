import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';

async function fetchCampaignVolunteered() {
  try {
    const api = gpApi.campaign.campaignVolunteer.listByUser;
    const token = getServerToken();

    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return {};
  }
}

export default async function volunteerAccess() {
  // don't remove this call. It prevents the build process to try to cache this page which should be dynamic
  // https://nextjs.org/docs/messages/dynamic-server-error
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }
  const { campaigns } = await fetchCampaignVolunteered();
  if (!campaigns || campaigns.length === 0) {
    redirect('/');
  }
  return campaigns;
}
