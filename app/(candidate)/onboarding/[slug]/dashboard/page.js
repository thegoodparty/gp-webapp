export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store'; //https://beta.nextjs.org/docs/api-reference/segment-config#fetchcache

import Dashboard from './components/Dashboard';
import campaignSteps, { generateCampaignStatus } from './campaignSteps';
import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Campaign Pre Launch | GOOD PARTY',
  description: 'Campaign Pre Launch - Candidate Onboarding.',
  slug: '/',
  image: 'https://assets.goodparty.org/dashboard.jpg',
});
export const metadata = meta;

export default async function Page({ params }) {
  const campaign = await getCampaign(params);

  // const sectionIndex =
  //   section && section.length > 0 ? parseInt(section[0]) - 1 : false;

  const campaignStatus = generateCampaignStatus(campaign);
  const shortVersion = campaign?.details?.filedStatement == 'yes';
  console.log('shortVersion', shortVersion, campaign.details.filedStatement);

  const nextStep = { ...campaignStatus.nextStep };
  delete campaignStatus.nextStep;

  const childProps = {
    campaign,
    campaignSteps,
    campaignStatus,
    nextStep,
    shortVersion,
  };

  return <Dashboard {...childProps} />;
}
