import { JsonLd } from 'react-schemaorg'
import { cmsToPlainText } from 'helpers/contentfulHelper'

export default function ArticleSchema({ article }) {
  if (!article) {
    return null
  }

  const {
    section,
    author,
    body,
    mainImage,
    publishDate,
    title,
    slug,
    summary,
  } = article

  const authorImage = author?.fields?.image?.fields?.file?.url
    ? `https:${author.fields.image.fields.file.url}`
    : null

  const mainImageUrl = mainImage?.url
    ? `https:${mainImage.url}`
    : 'https://assets.goodparty.org/gp-share.png'

  return (
    <JsonLd
      item={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        articleBody: cmsToPlainText(body) || '',
        articleSection: section?.fields?.title ?? '',
        genre: section?.fields?.title ?? '',
        author: author
          ? {
              name: author?.fields?.name || '',
              image: authorImage,
              description: author?.fields?.summary || '',
            }
          : null,
        image: mainImageUrl,
        headline: title || '',
        name: title || '',
        url: `https://goodparty.org/blog/article/${slug}`,
        datePublished: publishDate || new Date().toISOString(),
        description: summary || '',
      }}
    />
  )
}
