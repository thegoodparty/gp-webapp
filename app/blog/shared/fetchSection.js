import { apiRoutes } from 'gpApi/routes';
import { unAuthFetch } from 'gpApi/unAuthFetch';

export const fetchSection = async (sectionSlug) => {
  return await unAuthFetch(apiRoutes.content.blogArticle.getSection.path, {
    sectionSlug,
  });
};
