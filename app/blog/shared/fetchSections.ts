import { apiRoutes } from 'gpApi/routes'
import { unAuthFetch } from 'gpApi/unAuthFetch'

export const fetchSections = async () => {
  return await unAuthFetch(apiRoutes.content.blogArticle.getSections.path)
}


