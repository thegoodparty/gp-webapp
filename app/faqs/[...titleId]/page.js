import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { faqArticleRoute, slugify } from 'helpers/articleHelper';
import { notFound, redirect } from 'next/navigation';
import FaqsArticlePage from './components/FaqsArticlePage';

const fetchArticle = async (id) => {
  const api = { ...gpApi.content.contentByKey };
  api.url += `?key=faqArticles&subKey=id&subValue=${id}`;
  return gpFetch(api, false, 3600);
};

export default async function Page({ params, searchParams }) {
  const { titleId } = params;
  const title = titleId?.length > 0 ? titleId[0] : false;
  const id = titleId?.length > 1 ? titleId[1] : false;

  const { content } = await fetchArticle(id);
  if (!content) {
    notFound();
  }
  const articleTitle = content.title;
  if (slugify(articleTitle) !== title) {
    const correctRoute = faqArticleRoute(content);
    redirect(correctRoute);
  }

  const childProps = {
    article: content,
  };
  return <FaqsArticlePage {...childProps} />;
}

export async function generateStaticParams() {
  const api = { ...gpApi.content.contentByKey };
  api.url += '?key=faqArticles';
  const { content } = await gpFetch(api, false, 3600);

  return content.map((article) => {
    const title = slugify(article.title);
    const id = article.id;
    return {
      titleId: [title, id + ''],
    };
  });
}
