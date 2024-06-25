import { redirect } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import { cookies } from 'next/headers';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const meta = pageMetaData({
  title: 'Log out',
  description: 'Log out',
  slug: '/logout',
});
export const metadata = meta;

async function fetchLogout() {
  // clear cookies set by server.
  try {
    const api = gpApi.user.logout;
    return await gpFetch(api, false, false);
  } catch (e) {
    console.log('error at fetchLogout', e);
    return false;
  }
}

export async function GET() {
  const cookieStore = cookies();

  const resp = await fetchLogout();
  console.log('resp', resp);

  // clear all cookies set by client.
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });

  // redirect('/');
}
