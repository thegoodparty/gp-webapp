import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

interface Tag {
  slug: string
  name: string
}

export const fetchArticleTag = async (tag: string): Promise<Tag> =>
  await unAuthFetch(`${apiRoutes.content.articleTags.path}`, { tag })
