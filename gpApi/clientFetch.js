import { compile, parse } from 'path-to-regexp';
import { API_ROOT, VERSION_PREFIX } from './routes';

const IS_LOCAL_ENVIRONMENT =
  Boolean(
    typeof process !== 'undefined' &&
      process?.env?.NEXT_PUBLIC_APP_BASE?.includes('localhost'),
  ) ||
  Boolean(
    typeof window !== 'undefined' && window.location.href.includes('localhost'),
  );

/**
 * @typedef {Object} ApiEndpoint
 * @property {string} path - The request path, which may contain route parameters.
 * @property {string} method - The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
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
 * @param {number} [options.revalidate] - Specifies the revalidation time (in seconds) for caching purposes.
 * @param {string} [options.serverToken] - A token to be used in the request, when sending from server (see serverFetch)
 *
 * @returns {Promise<ApiResponse>} The response object containing the status and parsed data.
 */
export async function clientFetch(endpoint, data, options = {}) {
  const { path, method } = endpoint;
  const { revalidate, serverToken, returnFullResponse } = options;

  const url = buildUrl(path, data, method);

  const headers = {};
  if (serverToken) {
    headers.Authorization = `Bearer ${serverToken}`;
  }

  const shouldCache = revalidate && !IS_LOCAL_ENVIRONMENT;

  let body;
  if (data instanceof FormData) {
    body = data;
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data ?? {}); // to avoid sending empty object
  }

  const res = await fetch(url, {
    headers,
    method,
    credentials: 'include',
    mode: 'cors',
    body: method === 'GET' || method === 'DELETE' ? undefined : body,
    ...(shouldCache ? { next: { revalidate } } : { cache: 'no-store' }),
  });

  if (returnFullResponse) {
    return res;
  }

  const isJsonResponse = res.headers
    .get('Content-Type')
    ?.includes('application/json');

  const response = {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    data: isJsonResponse ? await res.json() : await res.text(),
  };

  return response;
}

/**
 * Constructs a URL by handling both route and query parameters.
 *
 * @param {string} path - The base URL path which may contain route parameter tokens.
 * @param {Object} data - Data object containing values for route parameters and/or query parameters.
 * @param {string} method - The HTTP method being used.
 * @returns {string} The fully constructed URL with replaced route parameters and appended query parameters (if applicable).
 */
function buildUrl(path, data, method) {
  // route params
  let pathname = handleRouteParams(path, data);

  // query params
  if ((method === 'GET' || method === 'DELETE') && data) {
    const params = new URLSearchParams(data);
    pathname = `${pathname}?${params.toString()}`;
  }

  return `${apiUrl}${pathname}`;
}

/**
 * Replaces route tokens in the URL's pathname using corresponding data values.
 *
 * @param {string} path - The URL containing route tokens.
 * @param {Object|FormData} data - Key-value pairs for token replacement.
 * @returns {string} The URL with tokens replaced.
 */
function handleRouteParams(path, data) {
  const { tokens } = parse(path);
  const hasRouteParams = tokens.some((token) => typeof token !== 'string');

  if (!hasRouteParams || !data) return path;

  // Find tokens that are parameters (objects with name property)
  const paramTokens = {};
  tokens.forEach((token) => {
    if (typeof token === 'object' && token.name) {
      const paramName = token.name;
      if (data instanceof FormData) {
        if (data.has(paramName)) {
          // Retrieve the param value from FormData.
          paramTokens[paramName] = String(data.get(paramName));
          // Remove the used parameter.
          data.delete(paramName);
        }
      } else {
        // Plain object lookup.
        if (Object.prototype.hasOwnProperty.call(data, paramName)) {
          paramTokens[paramName] = String(data[paramName]);
          delete data[paramName];
        }
      }
    }
  });

  // Compile the path with the coerced values
  return compile(path)(paramTokens);
}
