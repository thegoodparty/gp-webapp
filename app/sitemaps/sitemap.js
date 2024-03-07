import { alphabet } from 'app/political-terms/components/LayoutWithAlphabet';
import gpApi, { appBase } from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { faqArticleRoute } from '../../helpers/articleHelper';

const staticUrls = [
  '/',
  '/about',
  '/run-for-office',
  '/team',
  '/login',
  '/register',
  '/faqs',
  '/privacy',
  '/work-with-us',
  '/contact',
  '/pricing',
  '/political-terms',
  '/volunteer',
  '/academy',
  '/academy-intro',
  '/info-session',
  '/academy-webinar',
  '/blog',
  '/ads2023',
  '/elections',
];

export const fetchFAQs = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'faqArticles',
  };
  return await gpFetch(api, payload);
};

export const fetchGlossaryByTitle = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'glossaryItemsByTitle',
  };
  return await gpFetch(api, payload);
};

const fetchArticles = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'blogArticles',
  };
  return await gpFetch(api, payload, 3600);
};

export const fetchSections = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'blogSections',
    deleteKey: 'articles',
  };
  return await gpFetch(api, payload, 3600);
};

const now = new Date();

export default async function sitemap() {
  const mainSitemap = [];
  const staticUrls = [
    '/',
    '/about',
    '/run-for-office',
    '/team',
    '/login',
    '/register',
    '/faqs',
    '/privacy',
    '/work-with-us',
    '/contact',
    '/pricing',
    '/political-terms',
    '/volunteer',
    '/academy',
    '/academy-intro',
    '/info-session',
    '/academy-webinar',
    '/blog',
    '/ads2023',
    '/elections',
  ];

  staticUrls.forEach((url) => {
    mainSitemap.push({
      url: `${appBase}${url}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    });
  });
  try {
    const blogRes = await fetchArticles();
    const blogArticles = blogRes.content;
    const blogSectionsRes = await fetchSections();
    const blogSections = blogSectionsRes.content;
    blogArticles.forEach((article) => {
      mainSitemap.push({
        url: `${appBase}/blog/article/${article.slug}`,
        lastModified: article.publishDate,
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    });

    blogSections.forEach((section) => {
      mainSitemap.push({
        url: `${appBase}/blog/section/${section.fields?.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    });
  } catch (e) {
    console.log('error at blog SiteMapXML', e);
  }

  try {
    const faqArticles = (await fetchFAQs()).content;
    faqArticles.forEach((article) => {
      mainSitemap.push({
        url: `${appBase}${faqArticleRoute(article)}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  } catch (e) {
    console.log('error at faqs SiteMapXML', e);
  }
  alphabet.forEach((letter) => {
    mainSitemap.push({
      url: `${appBase}/political-terms/${letter}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  try {
    const { content } = await fetchGlossaryByTitle();
    Object.keys(content).forEach((slug) => {
      mainSitemap.push({
        url: `${appBase}/political-terms/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  } catch (e) {
    console.log('error at glossary SiteMapXML', e);
  }

  return mainSitemap;
}
