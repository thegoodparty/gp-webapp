import { adminAccessOnly } from 'helpers/permissionHelper';
import AdminTopIssuesPage from './components/AdminTopIssuesPage';
import pageMetaData from 'helpers/metadataHelper';
import { serverFetchIssues } from 'app/(candidate)/dashboard/campaign-details/components/issues/serverIssuesUtils';

const meta = pageMetaData({
  title: 'Top Issues | GoodParty.org',
  description: 'Admin Top Issues Dashboard.',
  slug: '/admin/top-issues',
});
export const metadata = meta;
export const maxDuration = 60;

export default async function Page() {
  await adminAccessOnly();
  const topIssues = await serverFetchIssues();
  const childProps = {
    pathname: '/admin/top-issues',
    title: 'Top Issues',
    topIssues,
  };
  return <AdminTopIssuesPage {...childProps} />;
}
