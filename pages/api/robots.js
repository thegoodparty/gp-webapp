import gpApi, { appBase, isProd } from 'gpApi';

export default async function sitemap(req, res) {
  try {
    let robots;
    if (isProd) {
      robots = `User-agent: *
Disallow: /api
Disallow: /admin/*

Sitemap: https://goodparty.org/sitemap.xml`;
    } else {
      robots = `User-agent: *
Disallow: /`;
    }

    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    return res.end(robots);
  } catch (e) {
    console.log('error at robots', e);
  }
}
