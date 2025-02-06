import pageMetaData from 'helpers/metadataHelper';
import { fetchArticlesBySections } from 'app/blog/shared/fetchArticlesBySections';
import BlogPage from './components/BlogPage';
import { serverFetch } from 'gpApi/serverFetch';
import { apiRoutes } from 'gpApi/routes';

export const fetchTopTags = async () => {
  const payload = {
    type: 'blogHome',
  };
  const resp = await serverFetch(apiRoutes.content.getByType, payload, {
    revalidate: 3600,
  });
  return resp.data;
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
