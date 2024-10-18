import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import CampaignAssistantPage from './components/CampaignAssistantPage';
import { getServerUser } from 'helpers/userServerHelper';
import { adminAccessOnly } from 'helpers/permissionHelper';

const meta = pageMetaData({
  title: 'Campaign Assistant | GoodParty.org',
  description: 'Campaign Assistant',
  slug: '/dashboard/campaign-assistant',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  // await candidateAccess();
  await adminAccessOnly();

  const user = getServerUser(); // can be removed when door knocking app is not for admins only
  const { campaign } = await fetchUserCampaign();

  const childProps = {
    pathname: '/dashboard/campaign-assistant',
    user,
    campaign,
  };

  return <CampaignAssistantPage {...childProps} />;
}