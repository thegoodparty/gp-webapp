import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Select account type',
  description: 'Select account type',
  slug: '/',
});
export const metadata = meta;

export default async function Page() {
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }
  return <div>select account type</div>;
}
