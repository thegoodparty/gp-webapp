import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import ProfilePage from './components/ProfilePage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Profile | GOOD PARTY',
  description: 'Sign into your profile on GOOD PARTY.',
  slug: '/profile',
});
export const metadata = meta;

export default function Page() {
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }
  return <ProfilePage />;
}
