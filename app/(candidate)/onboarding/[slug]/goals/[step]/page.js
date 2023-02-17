export const dynamic = 'force-dynamic';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import GoalsStepPage from './components/GoalsStepPage';
import goalsFields from './goalsFields';

export const fetchUserCampaignServer = async () => {
  const api = gpApi.campaign.onboarding.findByUser;
  const token = getServerToken();
  return await gpFetch(api, false, 3600, token);
};

// const generateWhyGoals = async () => {
//   const api = gpApi.campaign.onboarding.generateWhyGoals;
//   const token = getServerToken();
//   return await gpFetch(api, false, 3600, token);
// };

export default async function Page({ params }) {
  const { slug, step } = params;

  let stepInt = step ? parseInt(step, 10) : 1;

  let { campaign } = await fetchUserCampaignServer();
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }
  // if (!campaign.whyGoals) {
  //   ({ campaign } = await generateWhyGoals());
  // }

  const stepFields = goalsFields[stepInt - 1];

  const childProps = {
    title: stepFields.title.replace(
      '[[NAME]]',
      `${campaign.firstName} ${campaign.lastName}`,
    ),
    slug,
    campaign,
    fields: stepFields.fields,
    step: stepInt,
    pathname: `/goals/${stepInt}`,
  };
  return <GoalsStepPage {...childProps} />;
}
