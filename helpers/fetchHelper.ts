import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

export const fetchContentByType = async <T = unknown>(type: string): Promise<T> => {
  return await unAuthFetch(`${apiRoutes.content.byType.path}/${type}`)
}

