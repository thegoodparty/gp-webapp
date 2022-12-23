import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import FaqsPage from './components/FaqsPage';

const fetchContent = async () => {
  const api = { ...gpApi.content.contentByKey };
  api.url += '?key=articleCategories';
  return await gpFetch(api, false, 3600);
};

export default async function Page({ params, searchParams }) {
  const { content } = await fetchContent();
  const childProps = {
    content,
  };
  return <FaqsPage {...childProps} />;
}
