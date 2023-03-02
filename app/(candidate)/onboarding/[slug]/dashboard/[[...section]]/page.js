export const dynamic = 'force-dynamic';

import Dashboard from './components/Dashboard';
import campaignSteps, { generateCampaignStatus } from './campaignSteps';
import { fetchUserCampaignServer } from '../../details/[step]/page';

export default async function Page({ params }) {
  const { slug, section } = params;
  let { campaign } = await fetchUserCampaignServer();
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }

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
