import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = getServerUser();
  if (user) {
    redirect('/profile');
  }

  return <>Forgot</>;
}
