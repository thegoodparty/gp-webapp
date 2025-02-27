import { unAuthFetch } from 'gpApi/apiFetch';
import FaqsPage from './components/FaqsPage';
import pageMetaData from 'helpers/metadataHelper';
import { apiRoutes } from 'gpApi/routes';

export const revalidate = 3600;
export const dynamic = 'force-static';

const meta = pageMetaData({
  title: 'FAQs | GoodParty.org',
  description: 'Frequently Asked Questions about GoodParty.org.',
  slug: '/faqs',
});
export const metadata = meta;

const fetchContent = async () => {
  return await unAuthFetch(
    `${apiRoutes.content.byType.path}/articleCategories`,
  );
};

export default async function Page({ params, searchParams }) {
  const content = await fetchContent();
  const childProps = {
    content,
  };
  return <FaqsPage {...childProps} />;
}
