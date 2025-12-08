import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

export const fetchArticleTag = async (tag: string) =>
  await unAuthFetch(`${apiRoutes.content.articleTags.path}`, { tag })


