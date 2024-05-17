import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import CampaignPlanPage from './components/CampaignPlanPage';
import { getServerUser } from 'helpers/userServerHelper';
import { notFound } from 'next/navigation';
import { loadCandidatePosition } from 'app/(candidate)/dashboard/details/components/issues/issuesUtils';

const meta = pageMetaData({
  title: 'Campaign Plan | GoodParty.org',
  description: 'Campaign Plan',
  slug: '/dashboard/plan',
});
export const metadata = meta;

export default async function Page() {
  await candidateAccess();

  const { campaign } = await fetchUserCampaign();
  if (!campaign) {
    notFound();
  }
  const { candidatePositions } = await loadCandidatePosition(campaign.slug);

  const user = getServerUser(); // can be removed when door knocking app is not for admins only

  const childProps = {
    pathname: '/dashboard/plan',
    campaign,
    pathToVictory: campaign?.pathToVictory,
    candidatePositions,
    user,
  };

  return <CampaignPlanPage {...childProps} />;
}
