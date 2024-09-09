import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import BrowsingPage from 'app/(candidate)/onboarding/browsing/components/BrowsingPage';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function fetchUserMeta() {
  try {
    const api = gpApi.user.getMeta;
    const token = getServerToken();
    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error at fetchUserMeta', e);
    return {};
  }
}

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
  console.log('metaData', metaData);

  const childProps = {
    metaData,
  };

  return <BrowsingPage {...childProps} />;
}
