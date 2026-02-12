import { NextApiRequest, NextApiResponse } from 'next'
import { IS_PROD } from 'appEnv'

export default async function sitemap(
  _req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    let robots: string
    if (IS_PROD) {
      robots = `User-agent: *
Disallow: /api
Disallow: /admin/*

Sitemap: https://goodparty.org/sitemap.xml`
    } else {
      robots = `User-agent: *
Disallow: /`
    }

    res.writeHead(200, {
      'Content-Type': 'text/plain',
    })
    res.end(robots)
  } catch (e) {
    console.log('error at robots', e)
  }
}
