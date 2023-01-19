import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { portalAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import { fetchCandidate, fetchRole } from '../page';
import TopIssuesPage from './components/TopIssuesPage';

export const fetchTopIssues = async () => {
  const api = gpApi.topIssues.list;
  return await gpFetch(api, false, 3600);
};

export const fetchCandidatePositions = async (id) => {
  const api = gpApi.campaign.candidatePosition.list;
  const payload = { id };
  return await gpFetch(api, payload, 3600);
};

export default async function Page({ params }) {
  const { id } = params;

  const role = await fetchRole(id);
  portalAccessOnly(role);

  const { candidate } = await fetchCandidate(id);
  const { topIssues } = await fetchTopIssues();
  const { candidatePositions } = await fetchCandidatePositions(id);

  const childProps = {
    id,
    candidate,
    role,
    pathname: `/candidate-portal/${id}/top-issues`,
    title: `Edit top issues for ${candidate.firstName} ${candidate.lastName}`,
    topIssues,
    candidatePositions,
  };
  return <TopIssuesPage {...childProps} />;
}
