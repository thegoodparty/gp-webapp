import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import ProfilePage from './components/ProfilePage';

const meta = pageMetaData({
  title: 'Profile Settings',
  description: 'Profile settings for Good Party.',
});
export const metadata = meta;

export default function Page() {
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }
  return <ProfilePage user={user} />;
}
