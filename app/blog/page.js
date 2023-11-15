import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import BlogPage from './components/BlogPage';
import pageMetaData from 'helpers/metadataHelper';
import VwoScript from '@shared/scripts/VwoScript';

const meta = pageMetaData({
  title: 'Blog | GOOD PARTY',
  description: 'Good Party Blog',
  slug: '/blog',
});
export const metadata = meta;

export const fetchSections = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'blogSections',
    deleteKey: 'articles',
  };
  return await gpFetch(api, payload, 3600);
};

export const fetchArticlesBySections = async (sectionSlug) => {
  const api = gpApi.content.articlesBySection;
  const payload = {
    sectionSlug,
  };

  return await gpFetch(api, sectionSlug ? payload : false, 5);
};

export const fetchArticlesTitles = async () => {
  const api = gpApi.content.articlesTitles;
  return await gpFetch(api, false, 3600);
};

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
