import { apiRoutes } from 'gpApi/routes'
import { unAuthFetch } from 'gpApi/unAuthFetch'
import { BlogSection } from './fetchSections'

export const fetchSection = async (
  sectionSlug: string,
): Promise<BlogSection | null> => {
  return await unAuthFetch(apiRoutes.content.blogArticle.getSection.path, {
    sectionSlug,
  })
}
