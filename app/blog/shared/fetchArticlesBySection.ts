import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'
import { Article } from './ArticleSnippet'

interface FetchOptions {
  sectionSlug?: string
  limit?: number
}

interface ArticlesBySection {
  [sectionSlug: string]: Article[]
}

export const fetchArticlesBySection = async ({ sectionSlug, limit }: FetchOptions = {}): Promise<ArticlesBySection> => {
  return await unAuthFetch(apiRoutes.content.blogArticle.bySection.path, {
    ...(sectionSlug ? { sectionSlug } : {}),
    ...(limit ? { limit } : {}),
  })
}


