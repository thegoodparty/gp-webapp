import BlogPage from './components/BlogPage';
import pageMetaData from 'helpers/metadataHelper';
import { fetchArticlesBySections } from 'app/blog/shared/fetchArticlesBySections';
import { fetchArticlesTitles } from 'app/blog/shared/fetchArticlesTitles';

const meta = pageMetaData({
  title: 'Blog | GoodParty.org',
  description: 'GoodParty.org Blog',
  slug: '/blog',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  const { sections, hero } = await fetchArticlesBySections();

  const { titles } = await fetchArticlesTitles();

  const childProps = {
    sections,
    hero,
    articlesTitles: titles,
  };
  return <BlogPage {...childProps} />;
}
