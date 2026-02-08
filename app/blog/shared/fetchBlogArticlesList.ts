import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'
import { Article } from './ArticleSnippet'

interface FetchOptions {
  limit?: number
}

export const fetchBlogArticlesList = async ({ limit }: FetchOptions = {}): Promise<Article[]> => {
  return await unAuthFetch(apiRoutes.content.blogArticle.getList.path, {
    ...(limit ? { limit } : {}),
  })
}


