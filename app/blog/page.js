import pageMetaData from 'helpers/metadataHelper';
import { fetchArticlesBySections } from 'app/blog/shared/fetchArticlesBySections';
import BlogPage from './components/BlogPage';
import { apiFetch } from 'gpApi/apiFetch';

export const revalidate = 3600;
export const dynamic = 'force-static';

export const fetchTopTags = async () => {
  return await apiFetch('content/type/blogHome');
};

const meta = pageMetaData({
  title: 'Blog | GoodParty.org',
  description: 'GoodParty.org Blog',
  slug: '/blog',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  const { sections, hero } = await fetchArticlesBySections();
  const { tags } = await fetchTopTags();

  return <BlogPage sections={sections} hero={hero} topTags={tags} />;
}
