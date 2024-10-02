import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';

export async function fetchCampaignStatus(token) {
  try {
    const api = gpApi.user.campaignStatus;
    return await gpFetch(api, null, false, token);
  } catch (e) {
    console.log('error at fetchCampaignStatus', e);
    return { status: false };
  }
}

const getCampaignRequestsByUserId = async (userId) => {
  try {
    const token = getServerToken();
    return await gpFetch(
      gpApi.campaign.campaignRequests.list,
      {
        userId,
      },
      false,
      token,
    );
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return {};
  }
};

const getCampaignVolunteersByUserId = async (userId) => {
  try {
    const token = getServerToken();
    return await gpFetch(
      gpApi.campaign.campaignVolunteer.list,
      {
        userId,
      },
      false,
      token,
    );
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return {};
  }
};

export default async function candidateAccess() {
  // don't remove this call. It prevents the build process to try to cache this page which should be dynamic
  // https://nextjs.org/docs/messages/dynamic-server-error
  const token = getServerToken();
  const campaignStatus = await fetchCampaignStatus(token);
  const user = getServerUser();

  const campaignRequests = await getCampaignRequestsByUserId(user?.id);
  if (campaignRequests && campaignRequests.length) {
    return redirect('/onboarding/managing/final');
  }

  if (!['candidate', 'volunteer', 'manager'].includes(campaignStatus?.status)) {
    redirect('/');
  }
}
