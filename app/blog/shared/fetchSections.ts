import { apiRoutes } from 'gpApi/routes'
import { unAuthFetch } from 'gpApi/unAuthFetch'

export interface BlogSection {
  id?: string
  fields?: {
    title?: string
    subtitle?: string
    slug?: string
    order?: string | number
  }
  tags?: { name: string; slug: string }[]
}

export const fetchSections = async (): Promise<BlogSection[]> => {
  return await unAuthFetch(apiRoutes.content.blogArticle.getSections.path)
}
