import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { portalAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import PortalHomePage from './components/PortalHomePage';

export const fetchRole = async (id) => {
  const api = gpApi.campaign.role;
  const payload = { id };
  const token = getServerToken();
  return await gpFetch(api, payload, 3600, token);
};

export const fetchCandidate = async (id) => {
  const api = gpApi.campaign.find;
  const payload = { id };
  const token = getServerToken();
  return await gpFetch(api, payload, 3600, token);
};

export const fetchStats = async (id, range = 7) => {
  const api = gpApi.campaign.stats;
  const payload = { id, range };
  const token = getServerToken();
  return await gpFetch(api, payload, 3600, token);
};

export default async function Page({ params }) {
  const { id } = params;

  const role = await fetchRole(id);
  portalAccessOnly(role);

  const { candidate } = await fetchCandidate(id);
  const { stats, chart } = await fetchStats(id);

  const childProps = {
    id,
    candidate,
    role,
    pathname: `/candidate-portal/${id}`,
    title: `Analytics Dashboard for ${candidate.firstName} ${candidate.lastName}`,
    stats,
    chart,
  };
  return <PortalHomePage {...childProps} />;
}
