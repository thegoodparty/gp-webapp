import { redirect } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import { cookies } from 'next/headers';

const meta = pageMetaData({
  title: 'Log out',
  description: 'Log out',
  slug: '/logout',
});
export const metadata = meta;

export async function GET() {
  const cookieStore = cookies();

  // clear all colors
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
  redirect('/');
}
