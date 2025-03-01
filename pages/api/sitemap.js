import { APP_BASE } from 'appEnv';
import { flatStates } from 'helpers/statesHelper';

const appBase = APP_BASE;

let yourDate = new Date();
const currentDate = yourDate.toISOString().split('T')[0];

export default function sitemap(req, res) {
  const sitemaps = ['sitemaps/sitemap.xml'];
  flatStates.forEach((state, index) => {
    sitemaps.push(
      `sitemaps/state/${state.toLocaleLowerCase()}/sitemap/${index}.xml`,
    );
  });

  // candidates;
  flatStates.forEach((state, index) => {
    sitemaps.push(
      `sitemaps/candidates/${state.toLocaleLowerCase()}/sitemap/${index}.xml`,
    );
  });

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
