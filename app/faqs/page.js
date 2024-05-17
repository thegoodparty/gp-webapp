import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import FaqsPage from './components/FaqsPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'FAQs | GoodParty.org',
  description: 'Frequently Asked Questions about GoodParty.org.',
  slug: '/faqs',
});
export const metadata = meta;

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
