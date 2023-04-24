import { adminAccessOnly } from 'helpers/permissionHelper';
import { fetchCandidate } from '../page';
import PortalAdminPage from './components/PortalAdminPage';
import pageMetaData from 'helpers/metadataHelper';

export async function generateMetadata({ params }) {
  const { id } = params;
  const title = 'Candidate Admin | GOOD PARTY';
  const description = 'Candidate admin.';
  const meta = pageMetaData({
    title,
    description,
    slug: `/candidate-portal/${id}/admin`,
  });
  return meta;
}

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
