import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import { fetchUserMeta } from 'helpers/fetchUserMeta';
import { CandidateLookupPage } from 'app/(candidate)/onboarding/managing/candidate-lookup/components/CandidateLookupPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Find your candidate',
  description:
    'Please enter your candidate’s email address to find them on GoodParty.',
  slug: '/onboarding/managing/candidate-lookup',
});
export const metadata = meta;

const Page = async () => {
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }
  const metaData = await fetchUserMeta();

  const childProps = {
    metaData,
    user,
  };

  return <CandidateLookupPage {...childProps} />;
};

export default Page;
