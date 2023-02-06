export const dynamic = 'force-dynamic';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import { fetchUserCampaignServer } from '../why/page';
import OpponentPage from './components/OpponentPage';

const generateOpponentGoals = async () => {
  const api = gpApi.campaign.onboarding.generateOpponentGoals;
  const token = getServerToken();
  return await gpFetch(api, false, 3600, token);
};

export default async function Page({ params }) {
  const { slug } = params;

  let { campaign } = await fetchUserCampaignServer();
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }
  if (!campaign.opponent) {
    ({ campaign } = await generateOpponentGoals());
  }

  const childProps = {
    self: `/onboarding/${slug}/goals/why`,
    title: 'Goals & Objectives - Opponent',
    description: ' ',
    slug,
    campaign,
  };
  return <OpponentPage {...childProps} />;
}
