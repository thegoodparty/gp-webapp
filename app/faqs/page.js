import FaqsPage from './components/FaqsPage';
import pageMetaData from 'helpers/metadataHelper';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

const meta = pageMetaData({
  title: 'FAQs | GoodParty.org',
  description: 'Frequently Asked Questions about GoodParty.org.',
  slug: '/faqs',
});
export const metadata = meta;

const fetchContent = async () => {
  const resp = await serverFetch(
    apiRoutes.content.getByType,
    { type: 'articleCategories' },
    { revalidate: 3600 },
  );

  return resp.data;
};

export default async function Page({ params, searchParams }) {
  const content = await fetchContent();
  const childProps = {
    content,
  };
  return <FaqsPage {...childProps} />;
}
