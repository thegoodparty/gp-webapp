import pageMetaData from 'helpers/metadataHelper';
import PurchaseSuccessPage from 'app/(candidate)/dashboard/pro-sign-up/success/components/PurchaseSuccessPage';

const meta = pageMetaData({
  title: 'Pro Sign Up - Purchase Success | GoodParty.org',
  description: 'Pro Sign Up - Purchase Success',
  slug: '/dashboard/pro-sign-up/success',
});
export const metadata = meta;

export default async function Page() {
  return <PurchaseSuccessPage />;
}
