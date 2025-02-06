import { serverFetch } from 'gpApi/serverFetch';
import { apiRoutes } from 'gpApi/routes';

export const fetchArticlesBySections = async (sectionSlug) => {
  const payload = {
    sectionSlug,
  };

  const resp = await serverFetch(
    apiRoutes.content.blogArticle.getBySection,
    payload,
    {
      revalidate: 3600,
    },
  );

  return resp.data;
};
