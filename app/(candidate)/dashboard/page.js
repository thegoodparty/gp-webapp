import pageMetaData from 'helpers/metadataHelper';
import { fetchUserCampaign } from '../onboarding/shared/getCampaign';
import DashboardPage from './components/DashboardPage';
import candidateAccess from './shared/candidateAccess';
import { getServerUser } from 'helpers/userServerHelper';

const ENABLE_PRO_FLOW = process.env.NEXT_PUBLIC_PRO_FLOW;

const meta = pageMetaData({
  title: 'Campaign Dashboard | GoodParty.org',
  description: 'Campaign Dashboard',
  slug: '/dashboard',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();
  const { campaign } = await fetchUserCampaign();
  const { candidateSlug } = campaign;
  const user = getServerUser();
  const userMetaData = user?.metaData && JSON.parse(user.metaData);
  console.log(`userMetaData =>`, userMetaData); // can be removed when door knocking app is not for admins only

  const childProps = {
    pathname: '/dashboard',
    candidateSlug,
    campaign,
    user,
    userMetaData,
    enableProFlow: ENABLE_PRO_FLOW,
  };
  return <DashboardPage {...childProps} />;
}
