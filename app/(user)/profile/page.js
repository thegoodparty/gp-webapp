import { getServerUser } from 'helpers/userServerHelper';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ProfilePage from './components/ProfilePage';

export default function Page() {
  const user = getServerUser();
  if (!user) {
    redirect('/');
  }
  return <ProfilePage />;
}
