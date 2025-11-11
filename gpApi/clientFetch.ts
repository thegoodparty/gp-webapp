import { buildUrl } from '@shared/utils/buildUrl'
import { ApiRoute } from './routes'

export interface ApiResponse<T = unknown> {
  ok: boolean
  status: number
  statusText: string
  data: T
}

interface FetchOptions {
  cache?: RequestCache
  serverToken?: string
  returnFullResponse?: boolean
  revalidate?: number
}

export const clientFetch = async <T = unknown>(
  endpoint: ApiRoute,
  data?: Record<string, unknown> | FormData,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> => {
  const { method } = endpoint
  const { cache, serverToken, returnFullResponse } = options

  const url = buildUrl(endpoint, data)

  const headers: Record<string, string> = {}
  if (serverToken) {
    headers.Authorization = `Bearer ${serverToken}`
  }

  const shouldSetJsonContentType =
    method.toUpperCase() !== 'DELETE' && Boolean(data)

  let body: string | FormData | undefined
  if (data instanceof FormData) {
    body = data
  } else {
    if (shouldSetJsonContentType) {
      headers['Content-Type'] = 'application/json'
    }
    body = JSON.stringify(data ?? {})
  }

  const res = await fetch(url, {
    headers,
    method,
    credentials: 'include',
    mode: 'cors',
    body: method === 'GET' ? undefined : body,
    cache,
  })

  if (returnFullResponse) {
    return res as unknown as ApiResponse<T>
  }

  const isJsonResponse = res.headers
    .get('Content-Type')
    ?.includes('application/json')

  const response: ApiResponse<T> = {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    data: (isJsonResponse ? await res.json() : await res.text()) as T,
  }

  return response
}

