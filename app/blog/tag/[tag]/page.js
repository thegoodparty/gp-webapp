import { notFound } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import BlogTagPage from './components/BlogTagPage';
import { serverFetch } from 'gpApi/serverFetch';
import { apiRoutes } from 'gpApi/routes';
import { fetchArticlesBySections } from 'app/blog/shared/fetchArticlesBySections';
import { fetchArticleTags } from 'app/blog/shared/fetchArticleTags';
import { fetchArticlesTitles } from 'app/blog/shared/fetchArticlesTitles';

const fetchArticlesByTag = async (tag) => {
  const payload = {
    tag,
  };

  const resp = await serverFetch(
    apiRoutes.content.blogArticle.getByTag,
    payload,
    {
      revalidate: 3600,
    },
  );

  return resp.data;
};

const fetchArticleTag = async (tag) => {
  const payload = {
    tag,
  };

  const resp = await serverFetch(apiRoutes.content.articleTag, payload, {
    revalidate: 3600,
  });

  return resp.data;
};

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
