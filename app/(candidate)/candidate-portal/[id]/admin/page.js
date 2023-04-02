import { adminAccessOnly } from 'helpers/permissionHelper';
import { fetchCandidate } from '../page';
import PortalAdminPage from './components/PortalAdminPage';

export default async function Page({ params }) {
  const { id } = params;

  adminAccessOnly();

  const { candidate } = await fetchCandidate(id);

  const childProps = {
    id,
    candidate,
    pathname: `/candidate-portal/${id}/admin`,
    title: `Admin for ${candidate.firstName} ${candidate.lastName}`,
  };
  return <PortalAdminPage {...childProps} />;
}
