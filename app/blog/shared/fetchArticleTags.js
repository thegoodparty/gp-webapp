import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

export const fetchArticleTags = async () => {
  const resp = await serverFetch(apiRoutes.content.articleTags, undefined, {
    revalidate: 3600,
  });
  return resp.data;
};
