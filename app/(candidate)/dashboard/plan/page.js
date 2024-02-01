import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import CampaignPlanPage from './components/CampaignPlanPage';
import { fetchCandidate } from '../details/page';
import { loadCandidatePosition } from '../questions/page';

const meta = pageMetaData({
  title: 'Campaign Plan | GOOD PARTY',
  description: 'Campaign Plan',
  slug: '/dashboard/plan',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const { campaign } = await fetchUserCampaign();
  const { candidateSlug } = campaign;
  const { candidate } = await fetchCandidate(candidateSlug);
  const { candidatePositions } = await loadCandidatePosition(campaign.slug);

  const childProps = {
    pathname: '/dashboard/plan',
    campaign,
    candidate,
    candidateSlug,
    pathToVictory: campaign?.pathToVictory,
    candidatePositions,
  };

  return <CampaignPlanPage {...childProps} />;
}
