import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

export const fetchBlogArticlesList = async ({ limit } = {}) => {
  return await unAuthFetch(apiRoutes.content.blogArticle.getList.path, {
    ...(limit ? { limit } : {}),
  })
}
