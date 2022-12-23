import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import RegisterPage from './components/RegisterPage';

export default async function Page() {
  const user = getServerUser();
  if (user) {
    redirect('/profile');
  }
  return <RegisterPage />;
}
