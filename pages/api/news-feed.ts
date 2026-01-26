import { NextApiRequest, NextApiResponse } from 'next'
import RSS from 'rss'
import { fetchArticlesBySection } from 'app/blog/shared/fetchArticlesBySection'

export default async function feed(
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { news: articles } = await fetchArticlesBySection({
      sectionSlug: 'news',
    })

    const feed = new RSS({
      title: 'GoodParty.org News Feed',
      site_url: 'https://goodparty.org',
      feed_url: 'https://goodparty.org/feed.xml',
      image_url: 'https://assets.goodparty.org/heart-hologram.svg',
      language: 'en',
      description:
        'GoodParty.org is a movement bringing together voters and exciting independent candidates that can win.',
    })

    if (articles) {
      articles.forEach((article) => {
        const { title, mainImage, publishDate, slug, summary } = article
        const url = `https://goodparty.org/blog/article/${slug}`
        feed.item({
          title,
          description: summary,
          date: publishDate,
          url,
          link: url,
          guid: url,
          enclosure: {
            url: mainImage?.url,
          },
        })
      })
    }

    res.writeHead(200, {
      'Content-Type': 'application/xml',
    })
    res.end(feed.xml({ indent: true }))
  } catch (e) {
    console.log('error at generateSiteMapXML', e)
  }
}
