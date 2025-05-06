import { getCookie } from 'helpers/cookieHelper'

const IS_LOCAL_ENVIRONMENT =
  Boolean(
    typeof process !== 'undefined' &&
      process?.env?.NEXT_PUBLIC_APP_BASE?.includes('localhost'),
  ) ||
  Boolean(
    typeof window !== 'undefined' && window.location.href.includes('localhost'),
  )

async function gpFetch(
  endpoint,
  data,
  revalidate,
  token, // should only be used for server-side calls
  isFormData = false,
  nonJSON = false,
) {
  let { url, method, withAuth, returnFullResponse, additionalRequestOptions } =
    endpoint
  if ((method === 'GET' || method === 'DELETE') && data) {
    url = `${url}?`
    for (const key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        url += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`
      }
    }
    url = url.slice(0, -1)
  }

  let body = data
  if ((method === 'POST' || method === 'PUT') && data && !isFormData) {
    body = JSON.stringify(data)
  }

  let autoToken
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

function headersOptions(body, method = 'GET', token) {
  const headers = {}

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

async function fetchCall(
  url,
  options = {},
  revalidate,
  nonJSON,
  returnFullResponse = false,
) {
  if (options.method === 'GET') {
    delete options.body
  }
  let res
  if (revalidate && !IS_LOCAL_ENVIRONMENT) {
    res = await fetch(url, { ...options, next: { revalidate } })
  } else {
    res = await fetch(url, { ...options, cache: 'no-store' })
  }
  if (nonJSON || returnFullResponse) {
    return res
  }
  try {
    // TODO: We should consider returning the response as is and handle the error at the caller level.
    //  There's no way for the caller to determine how to react to error response states w/ this current pattern.
    const isSuccessfulResponseStatus = res.status >= 200 && res.status <= 299
    const jsonRes = isSuccessfulResponseStatus ? await res.json() : res
    return jsonRes
  } catch (e) {
    console.error('error in fetchCall catch', e)
    return false
  }
}
