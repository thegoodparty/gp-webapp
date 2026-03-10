import { NextApiRequest, NextApiResponse } from 'next'

export default async function sitemap(
  _req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const robots = `User-agent: *
Disallow: /`

    res.writeHead(200, {
      'Content-Type': 'text/plain',
    })
    res.end(robots)
  } catch (e) {
    console.log('error at robots', e)
  }
}
