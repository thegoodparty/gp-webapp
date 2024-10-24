import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import AccountTypePage from 'app/(candidate)/onboarding/account-type/components/AccountTypePage';

const meta = pageMetaData({
  title: 'Select account type',
  description: 'Select account type',
  slug: '/onboarding/account-type',
});
export const metadata = meta;

export default async function Page() {
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }

  return <AccountTypePage />;
}
