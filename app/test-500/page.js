import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Blog | GOOD PARTY',
  description: 'Good Party Blog',
  slug: '/blog',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  return <div>testing 500 {thisShouldFail}</div>;
}
