import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import CampaignPlanPage from './components/CampaignPlanPage';
import { loadCandidatePosition } from '../questions/page';
import { getServerUser } from 'helpers/userServerHelper';
import { notFound } from 'next/navigation';

const meta = pageMetaData({
  title: 'Campaign Plan | GOOD PARTY',
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
