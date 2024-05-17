import { notFound } from 'next/navigation';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import BlogPage from 'app/blog/components/BlogPage';
import pageMetaData from 'helpers/metadataHelper';
import {
  fetchArticlesBySections,
  fetchArticlesTitles,
  fetchSections,
} from 'app/blog/page';
import BlogArticleTagPage from './components/BlogArticleTagPage';

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

  const sectionsRes = await fetchSections();
  const sections = sectionsRes.content;

  const childProps = {
    sections,
    tagName,
    articles,
  };

  return <BlogArticleTagPage {...childProps} />;
}
