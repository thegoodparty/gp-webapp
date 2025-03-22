import { API_ROOT, API_VERSION_PREFIX } from 'appEnv';
import { handleRouteParams } from '@shared/utils/handleRouteParams';

/**
 * Constructs a URL by handling both route and query parameters.
 *
 * @param {string} path - The base URL path which may contain route parameter tokens.
 * @param {Object} data - Data object containing values for route parameters and/or query parameters.
 * @param {string} method - The HTTP method being used.
 * @returns {string} The constructed URL with replaced route parameters and appended query parameters.
 */
export function buildUrl({ path, method, nextApiRoute }, data) {
  // route params
  let pathname = handleRouteParams(path, data);

  // query params
  if ((method === 'GET' || method === 'DELETE') && data) {
    const params = new URLSearchParams(data);
    pathname = `${pathname}?${params.toString()}`;
  }

  if (nextApiRoute) {
    // Next.js API route, use the /api prefix without version prefix
    return `/api${pathname}`;
  }

  // Return a full API URL if running on the server,
  // otherwise just return the relative path prefixed with /api for proxy
  const root = typeof window === 'undefined' ? API_ROOT : '/api';
  return `${root}${API_VERSION_PREFIX}${pathname}`;
}
