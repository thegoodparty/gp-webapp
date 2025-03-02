import { unAuthFetch } from 'gpApi/apiFetch';
import { apiRoutes } from 'gpApi/routes';

export const fetchArticleTags = async () => {
  return await unAuthFetch(`${apiRoutes.content.articleTags.path}`);
};
