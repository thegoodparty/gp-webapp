import { unAuthFetch } from 'gpApi/unAuthFetch';
import { apiRoutes } from 'gpApi/routes';

export const fetchArticleTag = async (tag) =>
  await unAuthFetch(`${apiRoutes.content.articleTags.path}`, { tag });
