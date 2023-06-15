import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import BlogPage from './components/BlogPage';
import pageMetaData from 'helpers/metadataHelper';

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

export const fetchArticles = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'blogArticles',
    // limit: 20,
  };
  return await gpFetch(api, payload, 3600);
};

export default async function Page({ params, searchParams }) {
  const sectionsRes = await fetchSections();
  const sections = sectionsRes.content;
  const articlesRes = await fetchArticles();
  const fullArticles = articlesRes?.content;
  let articles = [];
  if (fullArticles != undefined) {
    articles = fullArticles.slice(0, 20);
  }

  const childProps = {
    sections,
    articles,
    fullArticles,
  };
  return <BlogPage {...childProps} />;
}
