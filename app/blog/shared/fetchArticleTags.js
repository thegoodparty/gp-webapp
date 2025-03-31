import { unAuthFetch } from 'gpApi/unAuthFetch';
import { apiRoutes } from 'gpApi/routes';

export const fetchArticleTags = async () => {
  return await unAuthFetch(`${apiRoutes.content.articleTags.path}`);
};
