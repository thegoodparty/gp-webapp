import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import { getServerUser } from 'helpers/userServerHelper';
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess';
import PurchaseRedirectPage from 'app/(candidate)/dashboard/pro-sign-up/purchase-redirect/components/PurchaseRedirectPage';

const meta = pageMetaData({
  title: 'Pro Sign Up - Purchase Redirect | GoodParty.org',
  description: 'Pro Sign Up - Purchase Redirect',
  slug: '/dashboard/pro-sign-up/purchase-redirect',
});
export const metadata = meta;

export default async function Page() {
  await candidateAccess();

  const { campaign } = await fetchUserCampaign();
  const user = getServerUser();

  const childProps = {
    campaign,
    user,
  };

  return <PurchaseRedirectPage {...childProps} />;
}
