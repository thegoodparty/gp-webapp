import { portalAccessOnly } from 'helpers/permissionHelper';
import { fetchCandidate, fetchRole, fetchStats } from '../page';
import EditCampaignPage from './components/EditCampaignPage';

export default async function Page({ params }) {
  const { id } = params;

  const role = await fetchRole(id);
  portalAccessOnly(role);

  const { candidate } = await fetchCandidate(id);

  const childProps = {
    id,
    candidate,
    role,
    pathname: `/candidate-portal/${id}/edit-campaign`,
    title: `Edit Campaign for ${candidate.firstName} ${candidate.lastName}`,
  };
  return <EditCampaignPage {...childProps} />;
}
