import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

interface FetchOptions {
  limit?: number
}

export const fetchBlogArticlesList = async ({ limit }: FetchOptions = {}) => {
  return await unAuthFetch(apiRoutes.content.blogArticle.getList.path, {
    ...(limit ? { limit } : {}),
  })
}


