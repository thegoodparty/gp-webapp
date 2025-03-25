import { unAuthFetch } from 'gpApi/unAuthFetch';
import { apiRoutes } from 'gpApi/routes';

export const fetchArticlesBySection = async ({ sectionSlug, limit } = {}) => {
  return await unAuthFetch(apiRoutes.content.blogArticle.bySection.path, {
    ...(sectionSlug ? { sectionSlug } : {}),
    ...(limit ? { limit } : {}),
  });
};
