import RSS from 'rss';
import { fetchArticlesBySections } from 'app/blog/shared/fetchArticlesBySections';

export default async function feed(req, res) {
  try {
    const { sections, hero, sectionIndex } = await fetchArticlesBySections(
      'news',
    );

    const feed = new RSS({
      title: 'GoodParty.org News Feed',
      site_url: 'https://goodparty.org',
      feed_url: 'https://goodparty.org/feed.xml',
      image_url: 'https://assets.goodparty.org/heart-hologram.svg',
      language: 'en',
      description:
        'GoodParty.org is a movement bringing together voters and exciting independent candidates that can win.',
    });
    sections[sectionIndex].articles.forEach((article) => {
      const { title, id, mainImage, publishDate, slug, summary } = article;
      const url = `https://goodparty.org/blog/article/${slug}`;
      feed.item({
        title,
        description: summary,
        date: publishDate,
        url,
        guid: url,
      });
    });

    res.writeHead(200, {
      'Content-Type': 'application/xml',
    });
    return res.end(feed.xml({ indent: true }));
  } catch (e) {
    console.log('error at generateSiteMapXML', e);
    return '';
  }
}
