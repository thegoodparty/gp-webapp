import { faqArticleRoute, slugify } from 'helpers/articleHelper';
import { notFound, permanentRedirect } from 'next/navigation';
import FaqsArticlePage from './components/FaqsArticlePage';
import pageMetaData from 'helpers/metadataHelper';
import { unAuthFetch } from 'gpApi/apiFetch';
import { apiRoutes } from 'gpApi/routes';

export const revalidate = 3600;
export const dynamic = 'force-static';

export const fetchArticle = async (id) => {
  return await unAuthFetch(`${apiRoutes.content.byId.path}/${id}`);
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

export async function generateStaticParams() {
  const faqArticles = await unAuthFetch(
    `${apiRoutes.content.byType.path}/articleCategories`,
  );
  let articles = [];

  faqArticles?.forEach((category) => {
    category?.articles?.forEach((article) => {
      articles.push({
        titleId: [slugify(article?.title, true), article?.id],
      });
    });
  });

  return articles;
}
