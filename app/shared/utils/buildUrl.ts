import { API_ROOT, API_VERSION_PREFIX } from 'appEnv'
import { handleRouteParams } from '@shared/utils/handleRouteParams'

interface BuildUrlEndpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  nextApiRoute?: boolean
}

export const buildUrl = (
  { path, method, nextApiRoute }: BuildUrlEndpoint,
  data?: Record<string, unknown> | FormData,
): string => {
  let pathname = handleRouteParams(path, data ?? {})

  if ((method === 'GET' || method === 'DELETE') && data) {
    const params = new URLSearchParams(data as Record<string, string>)
    pathname = `${pathname}?${params.toString()}`
  }

  if (nextApiRoute) {
    return `/api${pathname}`
  }

  const root = typeof window === 'undefined' ? API_ROOT : '/api'
  return `${root}${API_VERSION_PREFIX}${pathname}`
}
