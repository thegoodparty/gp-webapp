import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AdminTopIssuesPage from './components/AdminTopIssuesPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Top Issues | GoodParty.org',
  description: 'Admin Top Issues Dashboard.',
  slug: '/admin/top-issues',
});
export const metadata = meta;

const fetchIssues = async () => {
  const api = gpApi.admin.topIssues.list;
  const token = getServerToken();
  return await gpFetch(api, false, 1, token);
};

export default async function Page() {
  await adminAccessOnly();
  const res = await fetchIssues();
  const { topIssues } = res;
  const childProps = {
    pathname: '/admin/top-issues',
    title: 'Top Issues',
    topIssues,
  };
  return <AdminTopIssuesPage {...childProps} />;
}
