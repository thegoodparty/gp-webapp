import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import { BrowsingWelcomePage } from 'app/(candidate)/browsing-welcome/components/BrowsingWelcomePage';

const meta = pageMetaData({
  title: 'One final question',
  description: "Please select who you'd like to portray on your demo account:",
  slug: '/browsing-final',
});
export const metadata = meta;

export default async function Page() {
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }

  return <BrowsingWelcomePage user={user} />;
}
