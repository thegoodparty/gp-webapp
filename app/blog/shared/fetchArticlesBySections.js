import { serverFetch } from 'gpApi/serverFetch';
import { apiRoutes } from 'gpApi/routes';

export const fetchArticlesBySections = async (sectionSlug) => {
  let resp;
  if (sectionSlug) {
    resp = await serverFetch(
      apiRoutes.content.blogArticle.getBySection,
      {
        sectionSlug,
      },
      {
        revalidate: 3600,
      },
    );
  } else {
    resp = await serverFetch(apiRoutes.content.getBlogSections, undefined, {
      revalidate: 3600,
    });
  }
  return resp.data;
};
