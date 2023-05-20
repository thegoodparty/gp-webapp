import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import pageMetaData from 'helpers/metadataHelper';
import DashboardPage from './components/DashboardPage';

const meta = pageMetaData({
  title: 'Campaign Dashboard | GOOD PARTY',
  description: 'Campaign Dashboard',
  slug: '/dashboard',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  const childProps = {
    pathname: '/dashboard',
  };
  return <DashboardPage {...childProps} />;
}
