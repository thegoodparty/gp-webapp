import { apiFetch } from 'gpApi/apiFetch';

export const fetchArticlesBySections = async (sectionSlug) => {
  if (sectionSlug) {
    return await apiFetch(`content/blog-articles-by-section/${sectionSlug}`);
  } else {
    return await apiFetch('content/blog-articles-by-section');
  }
};
