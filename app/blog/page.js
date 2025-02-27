import pageMetaData from 'helpers/metadataHelper';
import { fetchArticlesBySections } from 'app/blog/shared/fetchArticlesBySections';
import BlogPage from './components/BlogPage';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

// export const fetchTopTags = async () => {
//   const api = gpApi.content.contentByKey;
//   const payload = {
//     key: 'blogHome',
//   };
//   return await gpFetch(api, payload, 3600);
// };

const meta = pageMetaData({
  title: 'Blog | GoodParty.org',
  description: 'GoodParty.org Blog',
  slug: '/blog',
});
export const metadata = meta;

// This makes the page static
export const dynamic = 'force-static';

// This caches the page on the edge
export const runtime = 'edge';

export const revalidate = 3600; // revalidate every hour

// If your page accepts dynamic parameters, you need to define them here
export async function generateStaticParams() {
  return [{}]; // For a single page with no parameters
}

export default async function Page({ params, searchParams }) {
  const { sections, hero } = await fetchArticlesBySections();
  // const { content: { tags } = {} } = await fetchTopTags();

  return <BlogPage sections={sections} hero={hero} />;
}
