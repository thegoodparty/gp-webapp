import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import BrowsingFinalPage from './components/BrowsingFinalPage';

const meta = pageMetaData({
  title: 'How would you like to demo GoodParty.org?',
  description: 'Please select which office you’d like to browse',
  slug: '/browsing-final',
});
export const metadata = meta;

export default async function Page() {
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }

  return <BrowsingFinalPage />;
}
