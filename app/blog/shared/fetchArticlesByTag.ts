import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

export const fetchArticlesByTag = async (tag: string) =>
  await unAuthFetch(`${apiRoutes.content.blogArticle.getByTag.path}`, {
    tag,
  })


