import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

interface FetchOptions {
  sectionSlug?: string
  limit?: number
}

export const fetchArticlesBySection = async ({ sectionSlug, limit }: FetchOptions = {}) => {
  return await unAuthFetch(apiRoutes.content.blogArticle.bySection.path, {
    ...(sectionSlug ? { sectionSlug } : {}),
    ...(limit ? { limit } : {}),
  })
}


