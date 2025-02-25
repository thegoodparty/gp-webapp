import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';
import { deleteUserCookies } from 'helpers/cookieHelper';

export async function fetchCampaignStatus() {
  try {
    const resp = await serverFetch(apiRoutes.campaign.status);
    if (resp.status === 498) {
      deleteUserCookies();
      redirect('/logout');
    }
    return resp.data;
  } catch (e) {
    console.log('error at fetchCampaignStatus', e);
    return { status: false };
  }
}

export default async function candidateAccess() {
  // don't remove this call. It prevents the build process to try to cache this page which should be dynamic.
  // https://nextjs.org/docs/messages/dynamic-server-error
  const campaignStatus = await fetchCampaignStatus();
  const user = getServerUser();

  if (!user) {
    return redirect('/sign-up');
  }

  if (!campaignStatus || campaignStatus.status !== 'candidate') {
    deleteUserCookies();
    redirect('/logout');
  }
}
