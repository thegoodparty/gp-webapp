import pageMetaData from 'helpers/metadataHelper';
import { fetchUserCampaign } from '../onboarding/shared/getCampaign';
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
  const { campaign } = await fetchUserCampaign();
  const { candidateSlug } = campaign;

  const childProps = {
    pathname: '/dashboard',
    candidateSlug,
  };
  return <DashboardPage {...childProps} />;
}
