import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import CampaignManagerPage from './components/CampaignManagerPage';
import { getServerUser } from 'helpers/userServerHelper';
import { adminAccessOnly } from 'helpers/permissionHelper';

const meta = pageMetaData({
  title: 'Campaign Manager | GoodParty.org',
  description: 'Campaign Manager',
  slug: '/dashboard/campaign-manager',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  // await candidateAccess();
  await adminAccessOnly();

  const user = getServerUser(); // can be removed when door knocking app is not for admins only
  const { campaign } = await fetchUserCampaign();

  const childProps = {
    pathname: '/dashboard/campaign-manager',
    user,
    campaign,
  };

  return <CampaignManagerPage {...childProps} />;
}
