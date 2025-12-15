import { JsonLd } from 'react-schemaorg'
import { cmsToPlainText } from 'helpers/contentfulHelper'
import { Document } from '@contentful/rich-text-types'

interface ArticleAuthor {
  fields?: {
    name?: string
    summary?: string
    image?: {
      fields?: {
        file?: {
          url?: string
        }
      }
    }
  }
}

interface ArticleSection {
  fields?: {
    title?: string
  }
}

interface ArticleImage {
  url?: string
}

interface Article {
  section?: ArticleSection
  author?: ArticleAuthor
  body?: Document
  mainImage?: ArticleImage
  publishDate?: string
  updateDate?: string
  title?: string
  slug?: string
  summary?: string
}

interface ArticleSchemaProps {
  article: Article | null
}

export default function ArticleSchema({
  article,
}: ArticleSchemaProps): React.JSX.Element | null {
  if (!article) {
    return null
  }

  const {
    section,
    author,
    body,
    mainImage,
    publishDate,
    updateDate,
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
              '@type': 'Person',
              name: author?.fields?.name || '',
              image: authorImage || undefined,
              description: author?.fields?.summary || '',
            }
          : undefined,
        image: mainImageUrl,
        headline: title || '',
        name: title || '',
        url: `https://goodparty.org/blog/article/${slug}`,
        datePublished: publishDate || new Date().toISOString(),
        ...(updateDate && { dateModified: updateDate }),
        description: summary || '',
      }}
    />
  )
}
