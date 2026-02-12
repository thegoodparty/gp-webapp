import { ofetch, type FetchOptions } from 'ofetch'
import { APIEndpoints } from './api-endpoints'

/**
 * Extracts the path parameters from a route.
 *
 * @example
 *
 * type Type1 = PathParamsOf<'GET /v1/items'>
 *   // -> { }
 * type Type2 = PathParamsOf<'GET /v1/items/:id'>
 *   // -> { id: string }
 * type Type3 = PathParamsOf<'GET /v1/items/:id/:something'>
 *   // -> { id: string; something: string }
 */
export type PathParamsOf<Route> =
  // First, filter out the leading method and space (e.g. the "GET ")
  Route extends `${string} ${infer Path}`
    ? PathParamsOf<Path>
    : // Now, split by the "/", and check the strings before + after.
    Route extends `${infer Before}/${infer After}`
    ? PathParamsOf<Before> & PathParamsOf<After>
    : // If the path part looks like a param, return the object.
    Route extends `:${infer Param}`
    ? {
        [Key in Param]: string
      }
    : {}

export type RequestPayloadOf<Route extends keyof APIEndpoints> =
  APIEndpoints[Route]['Request'] & PathParamsOf<Route>

/**
 * Substitutes path param values into our route syntax.
 *
 * @example
 * const result = substitutePathParams(
 *   '/items/:id',
 *   {
 *     id: 'something'
 *   }
 * );
 *
 * console.log(result); // "/items/something"
 */
const substitutePathParams = (route: string, params: object): string =>
  Object.entries(params).reduce(
    (url, [name, value]) => url.replace(':' + name, encodeURIComponent(value)),
    route,
  )

/**
 * Removes any keys in the request payload that already appear as path
 * parameters in the `route`, and returns the result. We do this because
 * path params should be directly substituded in the URL. Replacement is
 * skipped when the request payload is an array.
 *
 * @example
 * const result = removePathParamsFromRequestPayload(
 *   '/items/:id',
 *   {
 *     id: 'something',
 *     message: 'something-else'
 *   }
 * );
 *
 * console.log(result); // { message: 'something-else' }
 */
const removePathParamsFromRequestPayload = (route: string, payload: object) =>
  Object.entries(payload)
    .filter(([, value]) => value !== undefined)
    .reduce(
      (accum, [name, value]) =>
        route.includes(`:${name}`) ? accum : { ...accum, [name]: value },
      {},
    )

export type RequestOptions = FetchOptions<'json'>

export type Response<T> = {
  ok: boolean
  data: T
  status: number
  headers: Headers
}

export const createRequest =
  (augment: (opts: RequestOptions) => Promise<RequestOptions>) =>
  async <Route extends keyof APIEndpoints>(
    route: Route,
    payload: RequestPayloadOf<Route>,
    overrides?: RequestOptions,
  ): Promise<Response<APIEndpoints[Route]['Response']>> => {
    const [method, url] = route.split(' ')

    const requestPayload: APIEndpoints[Route]['Request'] =
      removePathParamsFromRequestPayload(url!, payload)

    let fetchOptions: RequestOptions = {
      method: method as RequestOptions['method'],
      responseType: 'json',
      headers: {},
    }

    if (['GET', 'DELETE'].includes(method!)) {
      fetchOptions.query = requestPayload
    } else {
      fetchOptions.body = requestPayload
    }

    const options = await augment(fetchOptions)

    const result = await ofetch.raw<APIEndpoints[Route]['Response']>(
      substitutePathParams(url!, payload),
      { ...options, ...overrides },
    )

    return {
      ok: result.ok,
      status: result.status,
      data: result._data!,
      headers: result.headers,
    }
  }

export const clientRequest = createRequest(async (opts) => {
  opts.baseURL = '/api'
  opts.credentials = 'include'
  return opts
})
