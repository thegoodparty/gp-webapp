import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import SetPasswordPage from './components/SetPasswordPage';
import pageMetaData from 'helpers/metadataHelper';
import { isValidEmail } from 'helpers/validations';

const meta = pageMetaData({
  title: 'Set Password | GoodParty.org',
  description: 'Set Password GoodParty.org.',
  slug: '/set-password',
});
export const metadata = meta;

export default async function Page({ searchParams }) {
  const user = await getServerUser();
  if (user) {
    redirect('/profile');
  }

  const { email: encodedEmail, token } = searchParams;
  const email = decodeURIComponent(encodedEmail);

  if (!email || !token) {
    redirect('/forgot-password');
  }

  if (!isValidEmail(email)) {
    redirect('/login');
  }

  return <SetPasswordPage email={email} token={token} />;
}
