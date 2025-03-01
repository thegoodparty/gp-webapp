import { notFound } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import BlogTagPage from './components/BlogTagPage';
import { apiRoutes } from 'gpApi/routes';
import { fetchArticlesBySections } from 'app/blog/shared/fetchArticlesBySections';
import { fetchArticleTags } from 'app/blog/shared/fetchArticleTags';
import { fetchArticlesTitles } from 'app/blog/shared/fetchArticlesTitles';
import { unAuthFetch } from 'gpApi/apiFetch';

export const revalidate = 3600;
export const dynamic = 'force-static';

const fetchArticlesByTag = async (tag) =>
  await unAuthFetch(`${apiRoutes.content.blogArticle.byTag.path}/${tag}`);

const fetchArticleTag = async (tag) =>
  await unAuthFetch(`${apiRoutes.content.articleTag.path}/${tag}`);

export async function generateMetadata({ params }) {
  const { tag } = params;

  const { name: tagName } = await fetchArticleTag(tag);

  const meta = pageMetaData({
    title: `${tagName} | GoodParty.org Blog`,
    description: `Good Part Blog ${tagName} tag`,
    slug: `/blog/tag/${tag}`,
  });
  return meta;
}

export default async function Page({ params }) {
  const { tag } = params;
  if (!tag) {
    notFound();
  }
  const [{ sections }, { name: tagName }, articles, tags, titles] =
    await Promise.all([
      fetchArticlesBySections(),
      fetchArticleTag(tag),
      fetchArticlesByTag(tag),
      fetchArticleTags(),
      fetchArticlesTitles(),
    ]);

  if (!articles) {
    return null;
  }

  return (
    <BlogTagPage
      sections={sections}
      tagName={tagName}
      tagSlug={tag}
      articles={articles}
      allTags={tags}
      articleTitles={titles}
    />
  );
}

export async function generateStaticParams() {
  const tags = await unAuthFetch(apiRoutes.content.articleTag.path);

  return tags?.map((tag) => {
    return {
      tag: tag?.slug,
    };
  });
}
