import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export const fetchArticlesTitles = async () => {
  const api = gpApi.content.articlesTitles;
  return await gpFetch(api, false, 3600);
};
