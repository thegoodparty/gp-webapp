import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import SignUpPage from './components/SignUpPage';
import pageMetaData from 'helpers/metadataHelper';
import { fetchCampaignStatus } from 'app/(candidate)/dashboard/shared/candidateAccess';

const REDIRECT_MSG = 'You are already signed in. Redirected to ';

const meta = pageMetaData({
  title: 'Sign up to GoodParty.org',
  description: 'Sign up to GoodParty.org.',
  slug: '/sign-up',
});
export const metadata = meta;

export default async function Page() {
  const user = getServerUser();
  if (user) {
    const { status, slug } = await fetchCampaignStatus();
    if (status === 'candidate') {
      redirect(`/dashboard?showRedirMsg=${REDIRECT_MSG} Dashboard`);
    } else if (slug) {
      redirect(`/onboarding/${slug}/1?showRedirMsg=${REDIRECT_MSG} Onboarding`);
    } else {
      redirect(`/profile?showRedirMsg=${REDIRECT_MSG} Profile`);
    }
  }
  return <SignUpPage />;
}
