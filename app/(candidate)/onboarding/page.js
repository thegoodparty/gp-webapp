export const dynamic = 'force-dynamic';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { redirect } from 'next/navigation';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import OnboardingStartPage from './components/OnboardingStartPage';

export async function fetchUserCampaign() {
  try {
    const api = gpApi.campaign.onboarding.findByUser;
    const token = getServerToken();
    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default async function Page() {
  const user = getServerUser();
  if (user) {
    const { campaign } = await fetchUserCampaign();
    if (campaign) {
      const { slug } = campaign;
      redirect(`/onboarding/${slug}/details/1`);
    }
  }
  const childProps = {
    title: "Hi! I'm Jared. Let's get your campaign started...",
    self: '/onboarding',
    slug: '',
  };
  return <OnboardingStartPage {...childProps} />;
}
