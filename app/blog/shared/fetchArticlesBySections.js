import { unAuthFetch } from 'gpApi/apiFetch';
import { apiRoutes } from 'gpApi/routes';

export const fetchArticlesBySections = async (sectionSlug) => {
  if (sectionSlug) {
    return await unAuthFetch(
      `${apiRoutes.content.getBlogSections.path}/${sectionSlug}`,
    );
  } else {
    return await unAuthFetch(apiRoutes.content.getBlogSections.path);
  }
};
