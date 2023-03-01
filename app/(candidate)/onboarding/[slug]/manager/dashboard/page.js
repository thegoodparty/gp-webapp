import { fetchUserCampaignServer } from '../../details/[step]/page';
import Dashboard from './components/Dashbaord';
import campaignSteps, { generateCampaignStatus } from './campaignSteps';

// export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
  const { slug } = params;
  let { campaign } = await fetchUserCampaignServer();
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }

  const campaignStatus = generateCampaignStatus(campaign);
  console.log('status', campaignStatus);

  const nextStep = { ...campaignStatus.nextStep };
  delete campaignStatus.nextStep;

  const childProps = {
    campaign,
    campaignSteps,
    campaignStatus,
    nextStep,
  };

  return <Dashboard {...childProps} />;
}
