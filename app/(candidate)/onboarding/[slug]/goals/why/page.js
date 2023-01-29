export const dynamic = 'force-dynamic';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import WhyPage from './components/WhyPage';

const fetchUserCampaignServer = async () => {
  const api = gpApi.campaign.onboarding.findByUser;
  const token = getServerToken();
  return await gpFetch(api, false, 3600, token);
};

const generateWhyGoals = async () => {
  const api = gpApi.campaign.onboarding.generateWhyGoals;
  const token = getServerToken();
  return await gpFetch(api, false, 3600, token);
};

export default async function Page({ params }) {
  const { slug } = params;

  let { campaign } = await fetchUserCampaignServer();
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }
  if (!campaign.whyGoals) {
    ({ campaign } = await generateWhyGoals());
  }

  const childProps = {
    self: `/onboarding/${slug}/goals/why`,
    title: 'Goals & Objectives',
    description:
      'A good campaign is based on a solid plan with clear objectives. Start building yours by defining your why. ',
    slug,
    campaign,
  };
  return <WhyPage {...childProps} />;
}
