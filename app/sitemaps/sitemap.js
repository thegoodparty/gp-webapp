import { alphabet } from 'app/political-terms/components/LayoutWithAlphabet';
import { faqArticleRoute } from '../../helpers/articleHelper';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

const appBase = process.env.NEXT_PUBLIC_APP_BASE;

export const fetchFAQs = async () => {
  const payload = {
    type: 'faqArticle',
  };
  const resp = await serverFetch(apiRoutes.content.getByType, payload);
  return resp.data;
};

export const fetchGlossaryByTitle = async () => {
  const resp = await serverFetch(apiRoutes.content.glossaryBySlug);
  return resp.data;
};

const fetchArticles = async () => {
  const payload = {
    type: 'blogArticle',
  };
  const resp = await serverFetch(apiRoutes.content.getByType, payload, {
    revalidate: 3600,
  });
  return resp.data;
};

export const fetchSections = async () => {
  const payload = {
    type: 'blogSections',
  };
  const resp = await serverFetch(apiRoutes.content.getByType, payload, {
    revalidate: 3600,
  });
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
      url: `${appBase}${url}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    });
  });
  try {
    const blogArticles = await fetchArticles();
    const blogSections = await fetchSections();
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
    const faqArticles = await fetchFAQs();
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
    const content = await fetchGlossaryByTitle();
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
