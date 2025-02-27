import pageMetaData from 'helpers/metadataHelper';
import { fetchArticlesBySections } from 'app/blog/shared/fetchArticlesBySections';
import BlogPage from './components/BlogPage';
import { apiFetch } from 'gpApi/apiFetch';
import { fetchArticleTags } from './shared/fetchArticleTags';
import { fetchArticlesTitles } from './shared/fetchArticlesTitles';

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

export default async function Page() {
  const [{ sections, hero }, { tags: topTags }, tags, titles] =
    await Promise.all([
      fetchArticlesBySections(),
      fetchTopTags(),
      fetchArticleTags(),
      fetchArticlesTitles(),
    ]);

  return (
    <BlogPage
      sections={sections}
      hero={hero}
      topTags={topTags}
      allTags={tags}
      articleTitles={titles}
    />
  );
}
