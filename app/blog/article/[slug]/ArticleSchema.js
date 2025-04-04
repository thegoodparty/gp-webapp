import { JsonLd } from 'react-schemaorg'
import { cmsToPlainText } from '/helpers/contentfulHelper'

export default function ArticleSchema({ article }) {
  const {
    section,
    author,
    body,
    mainImage,
    publishDate,
    readingTime,
    title,
    slug,
    summary,
  } = article

  return (
    <JsonLd
      item={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        articleBody: cmsToPlainText(body),
        articleSection: section?.fields?.title ?? '',
        genre: section?.fields?.title ?? '',
        wordCount: readingTime?.words,
        author: {
          name: author?.fields?.name,
          image: `https:${author?.fields?.image?.url}`,
          description: author?.fields?.summary,
        },
        image: `https:${mainImage?.url}`,
        headline: title,
        name: title,
        url: `https://goodparty.org/blog/article/${slug}`,
        datePublished: publishDate,
        description: summary,
      }}
    />
  )
}
