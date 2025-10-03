import { apiRoutes } from 'gpApi/routes'
import { unAuthFetch } from 'gpApi/unAuthFetch'

export const fetchArticle = async (slug) => {
  return await unAuthFetch(apiRoutes.content.blogArticle.getBySlug.path, {
    slug,
  })
}
