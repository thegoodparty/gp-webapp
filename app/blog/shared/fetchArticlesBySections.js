import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export const fetchArticlesBySections = async (sectionSlug) => {
  const api = gpApi.content.articlesBySection;
  const payload = {
    sectionSlug,
  };

  return await gpFetch(api, sectionSlug ? payload : false, 3600);
};
