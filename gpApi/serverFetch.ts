import { getServerToken } from 'helpers/userServerHelper'
import { clientFetch, ApiResponse } from './clientFetch'
import { ApiRoute } from './routes'

interface ServerFetchOptions {
  revalidate?: number
  cache?: RequestCache
  returnFullResponse?: boolean
}

export const serverFetch = async <T = unknown>(
  endpoint: ApiRoute,
  data?: Record<string, unknown> | FormData,
  options: ServerFetchOptions = {},
): Promise<ApiResponse<T>> => {
  const token = await getServerToken()
  return clientFetch<T>(endpoint, data, {
    ...options,
    serverToken: token || undefined,
  })
}

