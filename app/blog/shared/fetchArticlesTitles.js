import { unAuthFetch } from 'gpApi/apiFetch';
import { apiRoutes } from 'gpApi/routes';

export const fetchArticlesTitles = async () =>
  await unAuthFetch(`${apiRoutes.content.byType.path}/blogArticleTitles`);
