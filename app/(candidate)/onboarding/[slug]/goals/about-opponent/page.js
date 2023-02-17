export const dynamic = 'force-dynamic';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import { fetchUserCampaignServer } from '../[step]/page';
import AboutOpponentPage from './components/AboutOpponentPage';

const generateAboutOpponent = async () => {
  const api = gpApi.campaign.onboarding.generateAboutOpponentGoals;
  const token = getServerToken();
  return await gpFetch(api, false, 3600, token);
};

export default async function Page({ params }) {
  const { slug } = params;

  let { campaign } = await fetchUserCampaignServer();
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }
  if (!campaign.aboutOpponent) {
    ({ campaign } = await generateAboutOpponent());
  }

  const childProps = {
    self: `/onboarding/${slug}/goals/why`,
    title: 'Goals & Objectives - About Your Opponent',
    description: ' ',
    slug,
    campaign,
  };
  return <AboutOpponentPage {...childProps} />;
}
