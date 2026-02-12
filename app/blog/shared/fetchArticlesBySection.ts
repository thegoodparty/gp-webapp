import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'
import { Article } from './ArticleSnippet'

interface FetchOptions {
  sectionSlug?: string
  limit?: number
}

type ArticlesBySection = Partial<Record<string, Article[]>>

export const fetchArticlesBySection = async ({
  sectionSlug,
  limit,
}: FetchOptions = {}): Promise<ArticlesBySection> => {
  return await unAuthFetch(apiRoutes.content.blogArticle.bySection.path, {
    ...(sectionSlug ? { sectionSlug } : {}),
    ...(limit ? { limit } : {}),
  })
}
