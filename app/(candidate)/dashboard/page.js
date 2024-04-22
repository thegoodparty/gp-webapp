import pageMetaData from 'helpers/metadataHelper';
import { fetchUserCampaign } from '../onboarding/shared/getCampaign';
import DashboardPage from './components/DashboardPage';
import candidateAccess from './shared/candidateAccess';
import { getServerUser } from 'helpers/userServerHelper';

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
  const user = getServerUser(); // can be removed when door knocking app is not for admins only

  const childProps = {
    pathname: '/dashboard',
    candidateSlug,
    campaign,
    user,
  };
  return <DashboardPage {...childProps} />;
}
