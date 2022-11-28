// const articleHash = {};
// // returns only articles that match the page.
// const articlesHelper = (articles, page) =>
//   articles.filter((article) => {
//     let showArticle = false;
//     if (!article.pages) {
//       return false;
//     }
//     article.pages.forEach((cmsPage) => {
//       if (cmsPage === page) {
//         showArticle = true;
//         return true;
//       }
//     });
//     return showArticle;
//   });

export const slugify = (text) => {
  if (!text) {
    return '';
  }
  let textStr = text;
  if (typeof text === 'number') {
    textStr = text + '';
  }
  return textStr.replace(/[^\w ]+/g, '').replace(/ +/g, '-');
};

// export const getArticleById = (articles, id) => {
//   if (Object.keys(articleHash).length === 0) {
//     articles.forEach((article) => {
//       articleHash[article.id] = article;
//     });
//   }
//   return articleHash[id];
// };

// export default articlesHelper;

export const faqArticleRoute = (article) => {
  if (!article || !article.title || !article.id) {
    return '/';
  }
  const slug = slugify(article.title);
  return `/faqs/${slug}/${article.id}`;
};
