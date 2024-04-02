import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import ResetPasswordPage from './components/ResetPasswordPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Password Reset | GOOD PARTY',
  description: 'Password reset for Good Party.',
  slug: '/reset-password',
});
export const metadata = meta;

export default async function Page({ searchParams }) {
  const user = getServerUser();
  if (user) {
    redirect('/profile');
  }

  const { email: encodedEmail, token } = searchParams;
  const email = decodeURIComponent(encodedEmail);

  if (!email || !token) {
    redirect('/forgot-password');
  }

  const childProps = {
    email,
    token,
  };

  return <ResetPasswordPage {...childProps} />;
}
