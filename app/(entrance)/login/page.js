import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import LoginPage from './components/LoginPage';
import pageMetaData from 'helpers/metadataHelper';
import { fetchCampaignStatus } from 'app/(candidate)/dashboard/shared/candidateAccess';

const meta = pageMetaData({
  title: 'Login',
  description: 'Login to GoodParty.org.',
  slug: '/login',
});
export const metadata = meta;

export default async function Page() {
  if (await getServerUser()) {
    const { status, slug } = await fetchCampaignStatus();
    if (status === 'candidate') {
      redirect(`/dashboard`);
    } else if (slug) {
      redirect(`/onboarding/${slug}/1`);
    } else {
      redirect('/profile');
    }
  }
  return <LoginPage />;
}
