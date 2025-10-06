import { buildUrl } from '@shared/utils/buildUrl'

/**
 * @typedef {Object} ApiEndpoint
 * @property {string} path - The request path, which may contain route parameters.
 * @property {string} method - The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @property {boolean?} nextApiRoute - Indicates if the endpoint is a Next.js API route (/api folder routes).
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} ok - Indicates whether the response was successful.
 * @property {number} status - The HTTP status code.
 * @property {string} statusText - The HTTP status text.
 * @property {any} data - The parsed response data (JSON or text).
 */

/**
 * Performs an HTTP fetch request using the provided endpoint configuration and payload data.
 * @param {ApiEndpoint} endpoint - The endpoint configuration object.
 * @param {Record<string, any>|FormData} [data] - The payload data for the request. This data may be used to replace URL route parameters
 *   or be sent as query parameters/request body. If the payload is not a FormData instance, it is sent as JSON.
 * @param {Object} [options] - Additional options for the fetch request.
 * @param {string} [options.serverToken] - A token to be used in the request, when sending from server (see serverFetch)
 *
 * @returns {Promise<ApiResponse>} The response object containing the status and parsed data.
 */
export async function clientFetch(endpoint, data, options = {}) {
  const { method } = endpoint
  const { cache, serverToken, returnFullResponse } = options

  const url = buildUrl(endpoint, data)

  const headers = {}
  if (serverToken) {
    headers.Authorization = `Bearer ${serverToken}`
  }

  const shouldSetJsonContentType =
    method.toUpperCase() !== 'DELETE' && Boolean(data)

  let body
  if (data instanceof FormData) {
    body = data
  } else {
    shouldSetJsonContentType && (headers['Content-Type'] = 'application/json')
    body = JSON.stringify(data ?? {}) // to avoid sending empty object
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
    return res
  }

  const isJsonResponse = res.headers
    .get('Content-Type')
    ?.includes('application/json')

  const response = {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    data: isJsonResponse ? await res.json() : await res.text(),
  }

  return response
}
