import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

interface Tag {
  slug: string
  name: string
}

export const fetchArticleTags = async (): Promise<Tag[]> => {
  return await unAuthFetch(`${apiRoutes.content.articleTags.path}`)
}
