import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import { getServerUser } from 'helpers/userServerHelper';
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess';
import PurchaseRedirectPage from 'app/(candidate)/dashboard/pro-sign-up/purchase-redirect/components/PurchaseRedirectPage';
import { redirect } from 'next/navigation';

const ENABLE_PRO_FLOW = process.env.NEXT_PUBLIC_PRO_FLOW;

const meta = pageMetaData({
  title: 'Pro Sign Up - Purchase Redirect | GoodParty.org',
  description: 'Pro Sign Up - Purchase Redirect',
  slug: '/dashboard/pro-sign-up/purchase-redirect',
});
export const metadata = meta;

export default async function Page() {
  if (!ENABLE_PRO_FLOW) {
    redirect('/dashboard');
    return null;
  }

  await candidateAccess();

  const { campaign } = await fetchUserCampaign();
  const user = getServerUser();

  const childProps = {
    campaign,
    user,
  };

  return <PurchaseRedirectPage {...childProps} />;
}
