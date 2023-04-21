import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import RegisterPage from './components/RegisterPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Register | GOOD PARTY',
  description: 'Join us at Good Party.',
  slug: '/register',
});
export const metadata = meta;

export default async function Page() {
  const user = getServerUser();
  if (user) {
    redirect('/profile');
  }
  return <RegisterPage />;
}
