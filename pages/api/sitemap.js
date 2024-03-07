// import { candidateRoute } from '/helpers/electionsHelper';
// import apiHelper from '/helpers/apiHelper';
// import api from '/api/tgpApi';
// import tgpApi from '../../api/tgpApi';
// import { faqArticleRoute } from '../../helpers/faqHelper';

// const { default: Axios } = require('axios');

import gpApi, { appBase } from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

import { flatStates } from 'helpers/statesHelper';

const sitemaps = ['tomer'];

let yourDate = new Date();
const currentDate = yourDate.toISOString().split('T')[0];

export default async function sitemap(req, res) {
  const sitemaps = ['sitemaps/sitemap.xml'];
  let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    `;

  sitemaps.map((sitemap) => {
    xmlString += `
      <sitemap>
        <loc>${appBase}/${sitemap}</loc>
        <lastmod>${currentDate}</lastmod>
      </sitemap>
    `;
  });

  xmlString += '</sitemapindex>';

  res.writeHead(200, {
    'Content-Type': 'application/xml',
  });
  return res.end(xmlString);
}
