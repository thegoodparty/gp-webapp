import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import FaqModal from './FaqModal';

async function fetchArticle(articleId) {
  const api = { ...gpApi.content.contentByKey };
  api.url += `?key=faqArticles&subKey=id&subValue=${articleId}`;
  return gpFetch(api, false, 3600);
}

export default async function FaqLink({ children, articleId }) {
  const { content } = await fetchArticle(articleId);
  return <FaqModal article={content}>{children}</FaqModal>;
}
