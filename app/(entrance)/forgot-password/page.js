import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Forgot Password | GOOD PARTY',
  description: 'Password retrieval for Good Party.',
  slug: '/forgot-password',
});
export const metadata = meta;

export default async function Page() {
  const user = getServerUser();
  if (user) {
    redirect('/profile');
  }

  return <ForgotPasswordPage />;
}
