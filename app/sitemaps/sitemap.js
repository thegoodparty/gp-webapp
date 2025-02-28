import { alphabet } from 'app/political-terms/components/LayoutWithAlphabet';
import { faqArticleRoute } from '../../helpers/articleHelper';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';
import { APP_BASE } from 'appEnv';
import { fetchContentByType } from 'helpers/fetchHelper';

export const fetchFAQs = async () => {
  const payload = {
    type: 'faqArticle',
  };
  // const resp = await serverFetch(apiRoutes.content.getByType, payload);
  const resp = await fetchContentByType('faqArticle');
  return resp.data;
};

export const fetchGlossaryByTitle = async () => {
  const resp = await serverFetch(apiRoutes.content.glossaryBySlug);
  return resp.data;
};

const fetchArticles = async () => {
  const resp = await fetchContentByType('blogArticle');
  return resp.data;
};

export const fetchSections = async () => {
  const resp = await fetchContentByType('blogSections');
  return resp.data;
};

const now = new Date();

export default async function sitemap() {
  const mainSitemap = [];
  const staticUrls = [
    '/',
    '/about',
    '/run-for-office',
    '/team',
    '/candidates',
    '/login',
    '/register',
    '/faqs',
    '/privacy',
    '/work-with-us',
    '/contact',
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
      url: `${APP_BASE}${url}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    });
  });

  const blogArticles = await fetchArticles();
  const blogSections = await fetchSections();

  try {
    blogArticles.forEach((article) => {
      mainSitemap.push({
        url: `${APP_BASE}/blog/article/${article.slug}`,
        lastModified: article.publishDate,
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    });

    blogSections.forEach((section) => {
      mainSitemap.push({
        url: `${APP_BASE}/blog/section/${section.fields?.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    });
  } catch (e) {
    console.log('error at blog SiteMapXML', e);
  }

  const faqArticles = await fetchFAQs();

  try {
    faqArticles.forEach((article) => {
      mainSitemap.push({
        url: `${APP_BASE}${faqArticleRoute(article)}`,
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
      url: `${APP_BASE}/political-terms/${letter}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  const content = await fetchGlossaryByTitle();

  try {
    Object.keys(content).forEach((slug) => {
      mainSitemap.push({
        url: `${APP_BASE}/political-terms/${slug}`,
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
