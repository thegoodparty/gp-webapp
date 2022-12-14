import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { portalAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import { fetchCandidate, fetchRole } from '../page';
import EndorsementsPage from './components/EndorsementsPage';

export const fetchEndorsements = async (id) => {
  const api = gpApi.campaign.endorsement.list;
  const token = getServerToken();
  const payload = { candidateId: id };
  return await gpFetch(api, payload, false, token);
};

export default async function Page({ params }) {
  const { id } = params;

  const role = await fetchRole(id);
  portalAccessOnly(role);

  const { candidate } = await fetchCandidate(id);
  const { endorsements } = await fetchEndorsements(id);

  const childProps = {
    id,
    candidate,
    role,
    pathname: `/candidate-portal/${id}/endorsements`,
    title: `Endorsements for ${candidate.firstName} ${candidate.lastName}`,
    endorsements,
  };
  return <EndorsementsPage {...childProps} />;
}
