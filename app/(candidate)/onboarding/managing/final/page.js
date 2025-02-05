import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import { fetchUserMeta } from 'helpers/fetchUserMeta';
import pageMetaData from 'helpers/metadataHelper';
import { ManagingFinalPage } from 'app/(candidate)/onboarding/managing/final/components/ManagingFinalPage';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';

const meta = pageMetaData({
  title: 'Request Submitted',
  description: 'A confirmation has been sent to your candidate.',
  slug: '/onboarding/managing/final',
});
export const metadata = meta;

const Page = async () => {
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }
  const metaData = await fetchUserMeta();
  const { id: userId } = user;

  const requests = await gpFetch(
    gpApi.campaign.campaignRequests.get,
    {
      userId,
    },
    false,
    getServerToken(),
  );

  const { candidateEmail } = requests?.length ? requests[0] : {};

  const childProps = {
    metaData,
    candidateEmail,
  };

  return <ManagingFinalPage {...childProps} />;
};

export default Page;
