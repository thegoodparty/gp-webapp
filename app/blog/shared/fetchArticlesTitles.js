import { apiFetch } from 'gpApi/apiFetch';

export const fetchArticlesTitles = async () => {
  return await apiFetch('content/type/blogArticleTitles');

  return resp.data;
};
