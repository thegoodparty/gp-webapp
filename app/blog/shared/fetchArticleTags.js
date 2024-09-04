import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export const fetchArticleTags = async () => {
  const api = gpApi.content.articleTags;
  return await gpFetch(api, false, 3600);
};
