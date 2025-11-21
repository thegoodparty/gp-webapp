import { getServerToken } from 'helpers/userServerHelper'
import { clientFetch, ApiResponse } from './clientFetch'
import { ApiRoute } from './routes'

interface ServerFetchOptions {
  revalidate?: number
  returnFullResponse?: boolean
}

export async function serverFetch<T = unknown>(
  endpoint: ApiRoute,
  data: Record<string, unknown> | FormData | undefined,
  options: ServerFetchOptions & { returnFullResponse: true },
): Promise<Response>

export async function serverFetch<T = unknown>(
  endpoint: ApiRoute,
  data?: Record<string, unknown> | FormData,
  options?: Omit<ServerFetchOptions, 'returnFullResponse'> & {
    returnFullResponse?: false
  },
): Promise<ApiResponse<T>>

export async function serverFetch<T = unknown>(
  endpoint: ApiRoute,
  data?: Record<string, unknown> | FormData,
  options: ServerFetchOptions = {},
): Promise<ApiResponse<T> | Response> {
  const token = await getServerToken()

  if (options.returnFullResponse) {
    return clientFetch<T>(endpoint, data, {
      revalidate: options.revalidate,
      serverToken: token || undefined,
      returnFullResponse: true,
    })
  }

  const { returnFullResponse: _, ...restOptions } = options
  return clientFetch<T>(endpoint, data, {
    ...restOptions,
    serverToken: token || undefined,
  })
}
