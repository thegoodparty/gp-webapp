import { notFound } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import pageMetaData from 'helpers/metadataHelper';
import { fetchSections } from 'app/blog/shared/fetchSections';
import BlogTagPage from './components/BlogTagPage';

const fetchArticlesByTag = async (tag) => {
  const api = gpApi.content.articlesByTag;
  const payload = {
    tag,
  };

  return await gpFetch(api, payload, 1);
};

export async function generateMetadata({ params }) {
  const { tag } = params;

  const { tagName } = await fetchArticlesByTag(tag);

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
  const { tagName, articles } = await fetchArticlesByTag(tag);

  if (!articles) {
    return null;
  }

  const { content: sections } = await fetchSections();

  return (
    <BlogTagPage
      sections={sections}
      tagName={tagName}
      tagSlug={tag}
      articles={articles}
    />
  );
}
