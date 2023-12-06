// import { candidateRoute } from '/helpers/electionsHelper';
// import apiHelper from '/helpers/apiHelper';
// import api from '/api/tgpApi';
// import tgpApi from '../../api/tgpApi';
// import { faqArticleRoute } from '../../helpers/faqHelper';

// const { default: Axios } = require('axios');

import { alphabet } from 'app/political-terms/components/LayoutWithAlphabet';
import gpApi, { appBase } from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { faqArticleRoute } from '../../helpers/articleHelper';
import { candidateRoute } from '../../helpers/candidateHelper';

let yourDate = new Date();
const currentDate = yourDate.toISOString().split('T')[0];

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
];

export const fetchFAQs = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'faqArticles',
  };
  return await gpFetch(api, payload);
};

export const fetchCandidates = async () => {
  const api = { ...gpApi.candidate.list };
  return await gpFetch(api, false, 3600);
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

const fetchElections = async () => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'elections',
  };
  return await gpFetch(api, payload, 3600);
};

export default async function sitemap(req, res) {
  try {
    const faqArticles = (await fetchFAQs()).content;
    const { candidates } = await fetchCandidates();
    const { content } = await fetchGlossaryByTitle();
    const blogRes = await fetchArticles();
    const blogArticles = blogRes.content;
    const blogSectionsRes = await fetchSections();
    const blogSections = blogSectionsRes.content;

    const electionsRes = await fetchElections();
    const elections = electionsRes.content;

    let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    `;
    staticUrls.forEach((link) => {
      xmlString += `
        <url>
          <loc>${appBase}${link}</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>weekly</changefreq>
        </url>
      `;
    });
    faqArticles.forEach((article) => {
      xmlString += `
        <url>
          <loc>${appBase}${faqArticleRoute(article)}</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>monthly</changefreq>
        </url>
      `;
    });
    candidates.forEach((candidate) => {
      xmlString += `
        <url>
          <loc>${appBase}${candidateRoute(candidate)}</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>monthly</changefreq>
        </url>
      `;
    });

    alphabet.forEach((letter) => {
      xmlString += `
        <url>
          <loc>${appBase}/political-terms/${letter}</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>monthly</changefreq>
        </url>
      `;
    });

    Object.keys(content).forEach((slug) => {
      xmlString += `
        <url>
          <loc>${appBase}/political-terms/${slug}</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>monthly</changefreq>
        </url>
      `;
    });

    blogArticles.forEach((article) => {
      xmlString += `
        <url>
          <loc>${appBase}/blog/article/${article.slug}</loc>
          <lastmod>${article.publishDate}</lastmod>
          <changefreq>monthly</changefreq>
        </url>
      `;
    });

    blogSections.forEach((section) => {
      xmlString += `
        <url>
          <loc>${appBase}/blog/section/${section.fields?.slug}</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>monthly</changefreq>
        </url>
      `;
    });

    elections.forEach((election) => {
      if (election.slug.includes('-') === false) {
        return;
      }
      const city = election.slug.split('-')[0];
      const year = election.slug.split('-')[1];
      const currentYear = new Date().getFullYear();
      if (year.toString() != currentYear.toString()) {
        xmlString += `
        <url>
          <loc>${appBase}/elections/${city}/${year}</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>monthly</changefreq>
        </url>
      `;
      } else {
        xmlString += `
        <url>
          <loc>${appBase}/elections/${city}</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>monthly</changefreq>
        </url>
      `;
      }
    });

    xmlString += '</urlset>';

    res.writeHead(200, {
      'Content-Type': 'application/xml',
    });
    return res.end(xmlString);
  } catch (e) {
    console.log('error at generateSiteMapXML', e);
    return '';
  }
}
