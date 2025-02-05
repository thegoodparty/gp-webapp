import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import DetailsPage from './components/DetailsPage';
import { getServerUser } from 'helpers/userServerHelper';
import { fetchIssues } from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils';
import { serverLoadCandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/serverLoadCandidatePosition';

const meta = pageMetaData({
  title: 'campaign Details | GoodParty.org',
  description: 'Campaign Details',
  slug: '/dashboard/campaign-details',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const campaign = await fetchUserCampaign();
  const candidatePositions = await serverLoadCandidatePosition(campaign.id);
  const { topIssues } = await fetchIssues();
  const user = getServerUser(); // can be removed when door knocking app is not for admins only

  const childProps = {
    pathname: '/dashboard/campaign-details',
    campaign,
    candidatePositions,
    topIssues,
    pathToVictory: campaign?.pathToVictory,
    user,
  };

  return <DetailsPage {...childProps} />;
}
