import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import FaqModal from './FaqModal';

async function fetchArticle(articleId) {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'faqArticles',
    subKey: 'id',
    subValue: articleId,
  };
  return await gpFetch(api, payload, 3600);
}

export default async function FaqLink({ children, articleId }) {
  // const { content } = await fetchArticle(articleId);
  return null;
  return <FaqModal article={content}>{children}</FaqModal>;
}
