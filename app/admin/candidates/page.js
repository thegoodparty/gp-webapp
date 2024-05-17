import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AdminCandidatesPage from './components/AdminCandidatesPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Admin Candidates | GoodParty.org',
  description: 'Admin Candidates Dashboard.',
  slug: '/admin/candidates',
});
export const metadata = meta;

export const maxDuration = 60;
export const fetchCampaigns = async () => {
  const api = gpApi.campaign.list;
  const token = getServerToken();
  return await gpFetch(api, false, false, token);
};

export default async function Page() {
  adminAccessOnly();
  const { campaigns } = await fetchCampaigns();

  const childProps = {
    pathname: '/admin/candidates',
    title: 'Candidate List',
    campaigns,
  };
  return <AdminCandidatesPage {...childProps} />;
}
