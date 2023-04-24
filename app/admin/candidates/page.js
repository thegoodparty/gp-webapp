import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AdminCandidatesPage from './components/AdminCandidatesPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Admin Candidates | GOOD PARTY',
  description: 'Admin Candidates Dashboard.',
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
    title: 'Candidate List',
    candidates,
  };
  return <AdminCandidatesPage {...childProps} />;
}
