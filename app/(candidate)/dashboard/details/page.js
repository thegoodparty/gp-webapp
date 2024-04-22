import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import DetailsPage from './components/DetailsPage';
import { getServerUser } from 'helpers/userServerHelper';
import { fetchIssues, loadCandidatePosition } from '../questions/page';

const meta = pageMetaData({
  title: 'My Details | GOOD PARTY',
  description: 'My details',
  slug: '/dashboard/details',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const { campaign } = await fetchUserCampaign();
  const { candidatePositions } = await loadCandidatePosition(campaign.slug);
  const { topIssues } = await fetchIssues();
  const user = getServerUser(); // can be removed when door knocking app is not for admins only

  const childProps = {
    pathname: '/dashboard/details',
    campaign,
    candidatePositions,
    topIssues,
    pathToVictory: campaign?.pathToVictory,
    user,
  };

  return <DetailsPage {...childProps} />;
}
