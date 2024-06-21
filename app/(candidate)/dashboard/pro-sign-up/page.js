import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import { getServerUser } from 'helpers/userServerHelper';
import ProSignUpPage from 'app/(candidate)/dashboard/pro-sign-up/components/ProSignUpPage';
import { redirect } from 'next/navigation';

const ENABLE_PRO_FLOW = process.env.NEXT_PUBLIC_PRO_FLOW;

const meta = pageMetaData({
  title: 'Pro Sign Up | GoodParty.org',
  description: 'Pro Sign Up',
  slug: '/dashboard/pro-sign-up',
});
export const metadata = meta;

export default async function Page() {
  if (!ENABLE_PRO_FLOW) {
    redirect('/dashboard');
    return null;
  }

  await candidateAccess();

  const { campaign } = await fetchUserCampaign();
  const user = getServerUser();

  const childProps = {
    campaign,
    user,
  };

  return <ProSignUpPage {...childProps} />;
}
