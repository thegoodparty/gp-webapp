import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import BlogPage from './components/BlogPage';

export const fetchSections = async () => {
  const api = { ...gpApi.content.contentByKey };
  api.url += '?key=blogSections&deleteKey=articles';
  return gpFetch(api, false, 3600);
};

export const fetchArticles = async () => {
  const api = { ...gpApi.content.contentByKey };
  api.url += '?key=blogArticles&limit=20';
  return gpFetch(api, false, 3600);
};

export default async function Page({ params, searchParams }) {
  const sectionsRes = await fetchSections();
  const sections = sectionsRes.content;
  const articlesRes = await fetchArticles();
  const articles = articlesRes.content;

  const childProps = {
    sections,
    articles,
  };
  return <BlogPage {...childProps} />;
}
