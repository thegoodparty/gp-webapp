import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import ResetPasswordPage from './components/ResetPasswordPage';

export default async function Page({ searchParams }) {
  const user = getServerUser();
  if (user) {
    redirect('/profile');
  }

  const { email, token } = searchParams;
  if (!email || !token) {
    redirect('/forgot-password');
  }

  const childProps = {
    email,
    token,
  };

  return <ResetPasswordPage {...childProps} />;
}
