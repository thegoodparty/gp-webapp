import pageMetaData from 'helpers/metadataHelper';
import PurchaseSuccessPage from 'app/(candidate)/dashboard/pro-sign-up/success/components/PurchaseSuccessPage';
import { redirect } from 'next/navigation';

const ENABLE_PRO_FLOW = process.env.NEXT_PUBLIC_PRO_FLOW;

const meta = pageMetaData({
  title: 'Pro Sign Up - Purchase Success | GoodParty.org',
  description: 'Pro Sign Up - Purchase Success',
  slug: '/dashboard/pro-sign-up/success',
});
export const metadata = meta;

export default async function Page() {
  if (!ENABLE_PRO_FLOW) {
    redirect('/dashboard');
    return null;
  }
  return <PurchaseSuccessPage />;
}
