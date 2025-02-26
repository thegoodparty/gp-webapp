import { notFound } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import { fetchSections } from 'app/blog/shared/fetchSections';
import BlogTagPage from './components/BlogTagPage';
import { serverFetch } from 'gpApi/serverFetch';
import { apiRoutes } from 'gpApi/routes';

const fetchArticlesByTag = async (tag) => {
  const payload = {
    tag,
  };

  const resp = await serverFetch(
    apiRoutes.content.blogArticle.getByTag,
    payload,
    {
      revalidate: 1,
    },
  );

  return resp.data;
};

const fetchArticleTag = async (tag) => {
  const payload = {
    tag,
  };

  const resp = await serverFetch(apiRoutes.content.articleTag, payload, {
    revalidate: 1,
  });

  return resp.data;
};

export async function generateMetadata({ params }) {
  const { tag } = params;

  const { tagName } = await fetchArticleTag(tag);

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
  const { name: tagName } = await fetchArticleTag(tag);
  const articles = await fetchArticlesByTag(tag);

  if (!articles) {
    return null;
  }

  const sections = await fetchSections();

  return (
    <BlogTagPage
      sections={sections}
      tagName={tagName}
      tagSlug={tag}
      articles={articles}
    />
  );
}
