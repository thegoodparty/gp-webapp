import { cookies } from 'next/headers'
import { getServerToken } from 'helpers/userServerHelper'
import {
  ORG_SLUG_COOKIE,
  ORG_SLUG_HEADER,
} from '@shared/organizations/constants'
import { clientFetch, ApiResponse } from './clientFetch'
import { ApiRoute } from './routes'

interface ServerFetchOptions {
  revalidate?: number
  returnFullResponse?: boolean
}

export async function serverFetch(
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

  const cookieStore = await cookies()
  const orgSlug = cookieStore.get(ORG_SLUG_COOKIE)?.value
  const extraHeaders: Record<string, string> = {}
  if (orgSlug) {
    extraHeaders[ORG_SLUG_HEADER] = orgSlug
  }

  if (options.returnFullResponse) {
    return clientFetch(endpoint, data, {
      revalidate: options.revalidate,
      serverToken: token || undefined,
      returnFullResponse: true,
      extraHeaders,
    })
  }

  const { returnFullResponse: _, ...restOptions } = options
  return clientFetch<T>(endpoint, data, {
    ...restOptions,
    serverToken: token || undefined,
    extraHeaders,
  })
}
