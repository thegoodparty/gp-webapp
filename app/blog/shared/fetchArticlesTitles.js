import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

export const fetchArticlesTitles = async () => {
  const resp = await serverFetch(apiRoutes.content.getByType, {
    type: 'blogArticleTitles',
  });

  return resp.data;
};
