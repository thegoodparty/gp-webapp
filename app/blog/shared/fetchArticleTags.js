import { apiFetch } from 'gpApi/apiFetch';

export const fetchArticleTags = async () => {
  return await apiFetch('content/article-tags');
};
