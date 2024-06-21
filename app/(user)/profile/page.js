import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import ProfilePage from './components/ProfilePage';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';

const ENABLE_PRO_FLOW = process.env.NEXT_PUBLIC_PRO_FLOW;

async function fetchInvitations(token) {
  try {
    const api = gpApi.campaign.volunteerInvitation.listByUser;

    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return {};
  }
}

const meta = pageMetaData({
  title: 'Profile Settings',
  description: 'Profile settings for GoodParty.org.',
});
export const metadata = meta;

export default async function Page() {
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }
  const token = getServerToken();
  const { campaign } = await fetchUserCampaign();

  const { invitations } = await fetchInvitations(token);
  const childProps = {
    invitations,
    user,
    isPro: campaign?.isPro,
    enableProFlow: ENABLE_PRO_FLOW,
  };

  return <ProfilePage {...childProps} />;
}
