export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store'; //https://beta.nextjs.org/docs/api-reference/segment-config#fetchcache

import Dashboard from './components/Dashboard';
import campaignSteps, { generateCampaignStatus } from './campaignSteps';
import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';

export default async function Page({ params }) {
  const { section } = params;
  const campaign = await getCampaign(params);

  const sectionIndex =
    section && section.length > 0 ? parseInt(section[0]) - 1 : false;

  const campaignStatus = generateCampaignStatus(campaign);

  const nextStep = { ...campaignStatus.nextStep };
  delete campaignStatus.nextStep;

  const childProps = {
    campaign,
    campaignSteps,
    campaignStatus,
    nextStep,
    sectionIndex,
  };

  return <Dashboard {...childProps} />;
}
