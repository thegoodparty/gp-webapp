import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { portalAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import PortalHomePage from './components/PortalHomePage';

export const fetchRole = async (id) => {
  const api = { ...gpApi.campaign.role };
  api.url += `?id=${id}`;
  const token = getServerToken();
  return gpFetch(api, false, 3600, token);
};

export const fetchCandidate = async (id) => {
  const api = { ...gpApi.campaign.find };
  api.url += `?id=${id}`;
  const token = getServerToken();
  return gpFetch(api, false, 3600, token);
};

export default async function Page({ params }) {
  const { id } = params;

  const role = await fetchRole(id);
  portalAccessOnly(role);

  const { candidate } = await fetchCandidate(id);

  const childProps = {
    candidate,
    role,
    pathname: '/candidate-portal',
    title: `Analytics Dashboard for ${candidate.firstName} ${candidate.lastName}`,
  };
  return <PortalHomePage {...childProps} />;
}
