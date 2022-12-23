import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import ForgotPasswordPage from './components/ForgotPasswordPage';

export default async function Page() {
  const user = getServerUser();
  if (user) {
    redirect('/profile');
  }

  return <ForgotPasswordPage />;
}
