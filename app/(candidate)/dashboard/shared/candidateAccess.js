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

export default async function candidateAccess() {
  // don't remove this call. It prevents the build process to try to cache this page which should be dynamic.
  // https://nextjs.org/docs/messages/dynamic-server-error
  const token = getServerToken();
  const campaignStatus = await fetchCampaignStatus(token);
  const user = getServerUser();

  if (!user) {
    return redirect('/sign-up');
  }

  if (!campaignStatus || campaignStatus.status !== 'candidate') {
    redirect('/');
  }
}
