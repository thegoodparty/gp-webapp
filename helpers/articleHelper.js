import slugger from 'slugify';

export const slugify = (text, lowercase) => {
  if (!text) {
    return '';
  }
  if (lowercase) {
    return slugger(text, { lower: true });
  }
  return slugger(text);
};

export const faqArticleRoute = (article) => {
  if (!article || !article.title || !article.id) {
    return '/';
  }
  const slug = slugify(article.title, true);
  return `/faqs/${slug}/${article.id}`.toLowerCase();
};
