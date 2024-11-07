import pageMetaData from 'helpers/metadataHelper';
import DashboardPage from './components/DashboardPage';
import candidateAccess from './shared/candidateAccess';

const meta = pageMetaData({
  title: 'Campaign Dashboard | GoodParty.org',
  description: 'Campaign Dashboard',
  slug: '/dashboard',
});
export const metadata = meta;

export default async function Page() {
  await candidateAccess();

  return <DashboardPage pathname="/dashboard" />;
}
