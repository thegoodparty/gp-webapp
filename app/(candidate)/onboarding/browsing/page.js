import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import BrowsingPage from 'app/(candidate)/onboarding/browsing/components/BrowsingPage';
import { fetchUserMeta } from 'helpers/fetchUserMeta';

const meta = pageMetaData({
  title: 'explore GoodParty.org',
  description:
    "To help us make your experience even better, could you let us know why you're just browsing?",
  slug: '/onboarding/browsing',
});
export const metadata = meta;

export default async function Page() {
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }

  const { metaData } = await fetchUserMeta();

  const childProps = {
    metaData,
  };

  return <BrowsingPage {...childProps} />;
}
