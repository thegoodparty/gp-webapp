import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AdminTopIssuesPage from './components/AdminTopIssuesPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Top Issues | GOOD PARTY',
  description: 'Admin Top Issues Dashboard.',
  slug: '/admin/top-issues',
});
export const metadata = meta;

const fetchIssues = async () => {
  const api = gpApi.admin.topIssues.list;
  const token = getServerToken();
  return await gpFetch(api, false, false, token);
};

export default async function Page() {
  adminAccessOnly();
  const { topIssues } = await fetchIssues();
  const childProps = {
    pathname: '/admin/top-issues',
    title: 'Top Issues',
    topIssues,
  };
  return <AdminTopIssuesPage {...childProps} />;
}
