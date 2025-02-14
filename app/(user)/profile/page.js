import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import ProfilePage from './components/ProfilePage';
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';

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
  const { subscriptionCancelAt } = campaign?.details || {};

  const childProps = {
    user,
    isPro: campaign?.isPro,
    subscriptionCancelAt,
  };

  return <ProfilePage {...childProps} />;
}
