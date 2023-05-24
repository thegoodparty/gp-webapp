import pageMetaData from 'helpers/metadataHelper';
import DashboardPage from './components/DashboardPage';
import candidateAccess from './shared/candidateAccess';

const meta = pageMetaData({
  title: 'Campaign Dashboard | GOOD PARTY',
  description: 'Campaign Dashboard',
  slug: '/dashboard',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const childProps = {
    pathname: '/dashboard',
  };
  return <DashboardPage {...childProps} />;
}
