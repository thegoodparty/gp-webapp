import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';

import { cookies } from 'next/headers';

// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
export async function GET() {
  const nextCookies = cookies();
  const user = await getServerUser();
  if (!user) {
    nextCookies.set('returnUrl', 'profile');
    redirect('/login');
  } else {
    redirect('/profile');
  }
}
