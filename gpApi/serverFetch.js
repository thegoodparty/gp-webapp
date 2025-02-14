import { getServerToken } from 'helpers/userServerHelper';
import { clientFetch } from './clientFetch';

/**
 * Performs a server-side HTTP fetch request using the provided endpoint configuration and payload data.
 * This function wraps the clientFetch method and automatically injects the server token into the request options.
 *
 * @param {ApiEndpoint} endpoint - The endpoint configuration object used to build the request URL.
 * @param {Record<string, any>} [data] - The payload data for the request. This data may replace URL route parameters
 *    or be sent as query parameters/request body depending on the HTTP method.
 * @param {Object} [options={}] - Additional options for the fetch request.
 * @param {number} [options.revalidate] - Specifies the revalidation time (in seconds) for caching purposes.
 * */
export async function serverFetch(endpoint, data, options = {}) {
  return clientFetch(endpoint, data, {
    ...options,
    serverToken: getServerToken(),
  });
}
