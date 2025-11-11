import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

export const fetchContentByType = async (type: string): Promise<unknown> => {
  return await unAuthFetch(`${apiRoutes.content.byType.path}/${type}`)
}

