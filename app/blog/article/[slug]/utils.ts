import { apiRoutes } from 'gpApi/routes'
import { unAuthFetch } from 'gpApi/unAuthFetch'
import { Document } from '@contentful/rich-text-types'

interface ArticleImage {
  url?: string
  alt?: string
  size?: { width?: number; height?: number }
}

interface BannerData {
  title?: string
  description?: string
  buttonLabel?: string
  buttonLink?: string
  smallImage?: ArticleImage
  largeImage?: ArticleImage
  bannerClassName?: string
}

interface RelatedArticle {
  mainImage?: ArticleImage
  title?: string
  summary?: string
  slug?: string
}

export interface ArticleContent {
  title: string
  slug: string
  summary?: string
  mainImage?: {
    url?: string
    alt?: string
  }
  section?: {
    fields?: {
      slug?: string
      title?: string
    }
  }
  author?: {
    fields?: {
      name?: string
      image?: {
        fields?: {
          file?: {
            url?: string
          }
        }
      }
      summary?: string
    }
  }
  publishDate: string
  updateDate?: string
  body?: Document
  body2?: Document
  banner?: BannerData
  tags?: { slug: string; name: string }[]
  keyInformation?: string[]
  endHighlight?: Document
  relatedArticles?: RelatedArticle[]
  references?: {
    name: string
    description?: string
    url: string
  }[]
  statusCode?: number
}

export const fetchArticle = async (slug: string): Promise<ArticleContent> => {
  return await unAuthFetch(apiRoutes.content.blogArticle.getBySlug.path, {
    slug,
  })
}


