import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

export const fetchArticlesByTag = async (tag) =>
  await unAuthFetch(`${apiRoutes.content.blogArticle.getByTag.path}`, {
    tag,
  })
