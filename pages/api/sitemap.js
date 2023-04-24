// import { candidateRoute } from '/helpers/electionsHelper';
// import apiHelper from '/helpers/apiHelper';
// import api from '/api/tgpApi';
// import tgpApi from '../../api/tgpApi';
// import { faqArticleRoute } from '../../helpers/faqHelper';

// const { default: Axios } = require('axios');

import { alphabet } from 'app/political-terms/components/LayoutWithAlphabet';
import gpApi, { appBase } from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { faqArticleRoute, slugify } from '../../helpers/articleHelper';
import { candidateRoute } from '../../helpers/candidateHelper';

let yourDate = new Date();
const currentDate = yourDate.toISOString().split('T')[0];

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
  '/pricing',
  '/political-terms',
  '/volunteer',
  '/academy',
];

export const fetchContent = async () => {
  const api = gpApi.content.all;
  return await gpFetch(api, false, 3600);
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

export default async function sitemap(req, res) {
  try {
    const { faqArticles } = await fetchContent();
    const { candidates } = await fetchCandidates();
    const { content } = await fetchGlossaryByTitle();

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
          <changefreq>weekly</changefreq>
        </url>
      `;
    });

    alphabet.forEach((letter) => {
      xmlString += `
        <url>
          <loc>${appBase}/political-terms/${letter}</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>weekly</changefreq>
        </url>
      `;
    });

    Object.keys(content).forEach((slug) => {
      xmlString += `
        <url>
          <loc>${appBase}/political-terms/${slug}</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>weekly</changefreq>
        </url>
      `;
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
