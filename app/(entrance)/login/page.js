import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import LoginPage from './components/LoginPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Login',
  description: 'Login to Good Party.',
  slug: '/login',
});
export const metadata = meta;

export default async function Page() {
  const user = getServerUser();
  if (user) {
    redirect('/profile');
  }
  return <LoginPage />;
}
