import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { faqArticleRoute, slugify } from 'helpers/articleHelper';
import { notFound, redirect } from 'next/navigation';
import FaqsArticlePage from './components/FaqsArticlePage';
import pageMetaData from 'helpers/metadataHelper';

export const fetchArticle = async (id) => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'faqArticles',
    subKey: 'id',
    subValue: id,
  };

  return await gpFetch(api, payload, 3600);
};

export async function generateMetadata({ params }) {
  const { titleId } = params;
  const title = titleId?.length > 0 ? titleId[0] : false;
  const id = titleId?.length > 1 ? titleId[1] : false;
  const { content } = await fetchArticle(id);

  const meta = pageMetaData({
    title: `${content?.title} | FAQs | GOOD PARTY`,
    description: 'Frequently Asked Questions about GOOD PARTY.',
    slug: `/faqs/${title}/${id}`,
  });
  return meta;
}

export default async function Page({ params, searchParams }) {
  const { titleId } = params;
  const title = titleId?.length > 0 ? titleId[0] : false;
  const id = titleId?.length > 1 ? titleId[1] : false;

  const { content } = await fetchArticle(id);

  if (!content) {
    notFound();
  }
  const articleTitle = content.title;

  if (slugify(articleTitle, true) !== title.toLowerCase()) {
    const correctRoute = faqArticleRoute(content);
    redirect(correctRoute);
  }

  const childProps = {
    article: content,
  };
  return <FaqsArticlePage {...childProps} />;
}

// export async function generateStaticParams() {
//   const api = gpApi.content.contentByKey;
//   const payload = {
//     key: 'faqArticles',
//   };
//   const { content } = await gpFetch(api, payload, 3600);

//   return content.map((article) => {
//     const title = slugify(article.title);
//     const id = article.id;
//     return {
//       titleId: [title, id + ''],
//     };
//   });
// }
