export const dynamic = 'force-dynamic';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import { fetchUserCampaignServer } from '../../goals/why/page';
import WhyRunningPage from './components/WhyRunningPage';

// const generateWhyGoals = async () => {
//   const api = gpApi.campaign.onboarding.generateWhyGoals;
//   const token = getServerToken();
//   return await gpFetch(api, false, 3600, token);
// };

export default async function Page({ params }) {
  const { slug } = params;

  let { campaign } = await fetchUserCampaignServer();
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }
  // if (!campaign.whyGoals) {
  //   ({ campaign } = await generateWhyGoals());
  // }

  const childProps = {
    self: `/onboarding/${slug}/strategy/who-are-you`,
    title: 'Campaign Message & Strategy',
    description:
      'eu tincidunt tortor aliquam nulla facilisi cras fermentum odio eu feugiat pretium.',
    slug,
    campaign,
  };
  return <WhyRunningPage {...childProps} />;
}
