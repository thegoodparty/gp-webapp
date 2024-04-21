import { fetchUserCampaignOld } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import DetailsPage from './components/DetailsPage';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import { fetchIssues, loadCandidatePosition } from '../questions/page';

export const fetchCandidate = async (slug) => {
  try {
    const api = gpApi.candidate.find;
    const payload = {
      slug,
      allFields: true,
    };
    return await gpFetch(api, payload, 3600);
  } catch (e) {
    return false;
  }
};

const fetchPositions = async () => {
  const api = gpApi.admin.position.list;
  const token = getServerToken();
  return await gpFetch(api, false, 3600, token);
};

const meta = pageMetaData({
  title: 'My Details | GOOD PARTY',
  description: 'My details',
  slug: '/dashboard/details',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const { campaign } = await fetchUserCampaignOld();
  // const { candidate, candidatePositions } = await fetchCandidate(candidateSlug);
  // const { positions } = await fetchPositions();
  const { candidatePositions } = await loadCandidatePosition(campaign.slug);
  const { topIssues } = await fetchIssues();
  const user = getServerUser(); // can be removed when door knocking app is not for admins only

  const childProps = {
    pathname: '/dashboard/details',
    campaign,
    candidatePositions,
    // positions,
    // candidate,
    topIssues,
    pathToVictory: campaign?.pathToVictory,
    user,
  };

  return <DetailsPage {...childProps} />;
}
