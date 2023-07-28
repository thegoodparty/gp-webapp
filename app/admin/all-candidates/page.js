import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import pageMetaData from 'helpers/metadataHelper';
import AdminAllCandidatesPage from './components/AdminAllCandidatesPage';

const meta = pageMetaData({
  title: 'All Candidates | GOOD PARTY',
  description: 'Admin all Candidates',
  slug: '/admin/candidates',
});
export const metadata = meta;

export const fetchCandidates = async () => {
  const api = gpApi.admin.candidates;
  const token = getServerToken();
  return await gpFetch(api, false, false, token);
};

export default async function Page() {
  adminAccessOnly();
  const { candidates } = await fetchCandidates();

  const childProps = {
    pathname: '/admin/candidates',
    title: 'All Candidate List',
    candidates,
  };
  return <AdminAllCandidatesPage {...childProps} />;
}
