import pageMetaData from 'helpers/metadataHelper';
import ClientBreak from './clientBreak';

const meta = pageMetaData({
  title: 'Blog | GOOD PARTY',
  description: 'Good Party Blog',
  slug: '/blog',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  return <ClientBreak />;
}
