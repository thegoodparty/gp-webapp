import { buildUrl } from '@shared/utils/buildUrl'
import { getCookie } from 'helpers/cookieHelper'
import {
  ORG_SLUG_COOKIE,
  ORG_SLUG_HEADER,
} from '@shared/organizations/constants'
import { ApiRoute } from './routes'

export interface ApiResponse<T = unknown> {
  ok: boolean
  status: number
  statusText: string
  data: T
}

interface FetchOptions {
  serverToken?: string
  returnFullResponse?: boolean
  revalidate?: number
  extraHeaders?: Record<string, string>
}

export async function clientFetch(
  endpoint: ApiRoute,
  data: Partial<Record<string, unknown>> | FormData | undefined,
  options: FetchOptions & { returnFullResponse: true },
): Promise<Response>

export async function clientFetch<T = unknown, Y = unknown>(
  endpoint: ApiRoute,
  data?: Partial<Record<string, unknown>> | FormData | Y,
  options?: Omit<FetchOptions, 'returnFullResponse'> & {
    returnFullResponse?: false
  },
): Promise<ApiResponse<T>>

export async function clientFetch<T = unknown>(
  endpoint: ApiRoute,
  data?: Partial<Record<string, unknown>> | FormData,
  options: FetchOptions = {},
): Promise<ApiResponse<T> | Response> {
  const { method } = endpoint
  const { revalidate, serverToken, returnFullResponse, extraHeaders } = options

  const url = buildUrl(endpoint, data)

  const headers: Record<string, string> = { ...extraHeaders }
  if (serverToken) {
    headers.Authorization = `Bearer ${serverToken}`
  }

  const orgSlug = getCookie(ORG_SLUG_COOKIE)
  if (orgSlug) {
    headers[ORG_SLUG_HEADER] = orgSlug
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
    ...(typeof revalidate === 'number'
      ? { next: { revalidate } }
      : { cache: 'no-store' }),
  })

  if (returnFullResponse) {
    return res
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
