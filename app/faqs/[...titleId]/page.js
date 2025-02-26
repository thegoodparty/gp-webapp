import { faqArticleRoute, slugify } from 'helpers/articleHelper';
import { notFound, permanentRedirect } from 'next/navigation';
import FaqsArticlePage from './components/FaqsArticlePage';
import pageMetaData from 'helpers/metadataHelper';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

export const fetchArticle = async (id) => {
  const resp = await serverFetch(
    apiRoutes.content.getById,
    { id },
    { revalidate: 3600 },
  );

  return resp.data;
};

export async function generateMetadata({ params }) {
  const { titleId } = params;
  const title = titleId?.length > 0 ? titleId[0] : false;
  const id = titleId?.length > 1 ? titleId[1] : false;
  const content = await fetchArticle(id);

  const meta = pageMetaData({
    title: `${content?.title} | FAQs | GoodParty.org`,
    description: 'Frequently Asked Questions about GoodParty.org.',
    slug: `/faqs/${title}/${id}`,
  });
  return meta;
}

export default async function Page({ params, searchParams }) {
  const { titleId } = params;
  const title = titleId?.length > 0 ? titleId[0] : false;
  const id = titleId?.length > 1 ? titleId[1] : false;
  const content = await fetchArticle(id);

  if (!content) {
    notFound();
  }
  const articleTitle = content.title;

  if (slugify(articleTitle, true) !== title.toLowerCase()) {
    const correctRoute = faqArticleRoute(content);
    permanentRedirect(correctRoute);
  }

  const childProps = {
    article: content,
  };

  return <FaqsArticlePage {...childProps} />;
}
