import { getCookie } from 'helpers/cookieHelper'

const IS_LOCAL_ENVIRONMENT =
  Boolean(
    typeof process !== 'undefined' &&
      process?.env?.NEXT_PUBLIC_APP_BASE?.includes('localhost'),
  ) ||
  Boolean(
    typeof window !== 'undefined' && window.location.href.includes('localhost'),
  )

interface GpFetchEndpoint {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  withAuth?: boolean
  returnFullResponse?: boolean
  additionalRequestOptions?: RequestInit
}

const gpFetch = async (
  endpoint: GpFetchEndpoint,
  data?: Record<string, unknown> | FormData,
  revalidate?: number,
  token?: string,
  isFormData: boolean = false,
  nonJSON: boolean = false,
): Promise<Response | Record<string, unknown> | false> => {
  let { url, method, withAuth, returnFullResponse, additionalRequestOptions } =
    endpoint
  if ((method === 'GET' || method === 'DELETE') && data && !(data instanceof FormData)) {
    url = `${url}?`
    for (const key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        const value = data[key]
        url += `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}&`
      }
    }
    url = url.slice(0, -1)
  }

  let body: BodyInit | undefined = data instanceof FormData ? data : undefined
  if ((method === 'POST' || method === 'PUT') && data && !isFormData) {
    body = JSON.stringify(data)
  }

  let autoToken: string | false | undefined
  if (withAuth) {
    autoToken = getCookie('impersonateToken') || token
  }

  const requestOptions = headersOptions(body, endpoint.method, autoToken)

  return await fetchCall(
    url,
    { ...requestOptions, ...additionalRequestOptions },
    revalidate,
    nonJSON,
    returnFullResponse,
  )
}

export default gpFetch

const headersOptions = (
  body: BodyInit | undefined,
  method: string = 'GET',
  token: string | false | undefined,
): RequestInit => {
  const headers: Record<string, string> = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return {
    headers,
    method,
    credentials: 'include',
    mode: 'cors',
    body,
  }
}

const fetchCall = async (
  url: string,
  options: RequestInit = {},
  revalidate?: number,
  nonJSON?: boolean,
  returnFullResponse: boolean = false,
): Promise<Response | Record<string, unknown> | false> => {
  if (options.method === 'GET') {
    delete options.body
  }
  let res: Response
  if (revalidate && !IS_LOCAL_ENVIRONMENT) {
    res = await fetch(url, { ...options, next: { revalidate } })
  } else {
    res = await fetch(url, { ...options, cache: 'no-store' })
  }
  if (nonJSON || returnFullResponse) {
    return res
  }
  try {
    const isSuccessfulResponseStatus = res.status >= 200 && res.status <= 299
    const jsonRes: Record<string, unknown> | Response = isSuccessfulResponseStatus ? await res.json() : res
    return jsonRes
  } catch (e) {
    console.error('error in fetchCall catch', e)
    return false
  }
}
