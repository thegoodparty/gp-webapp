import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import { fetchUserMeta } from 'helpers/fetchUserMeta';
import pageMetaData from 'helpers/metadataHelper';
import { ManagingFinalPage } from 'app/(candidate)/onboarding/managing/final/components/ManagingFinalPage';

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
  const { metaData } = await fetchUserMeta();

  const childProps = {
    metaData,
    candidateEmail: 'candidate@campaign.org', // TODO: get this from invites/requests record
  };

  return <ManagingFinalPage {...childProps} />;
};

export default Page;
