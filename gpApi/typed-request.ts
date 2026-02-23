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

export type RequestOptions = {
  method?: string
  headers?: Record<string, string>
  baseURL?: string
  credentials?: RequestCredentials
}

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
  ): Promise<Response<APIEndpoints[Route]['Response']>> => {
    const [method, url] = route.split(' ')

    const requestPayload: APIEndpoints[Route]['Request'] =
      removePathParamsFromRequestPayload(url!, payload)

    let fetchOptions: RequestOptions = {
      method,
      headers: {},
    }

    const finalUrl = substitutePathParams(url!, payload)
    let fullUrl: string

    if (['GET', 'DELETE'].includes(method!)) {
      const query = new URLSearchParams(
        requestPayload as Record<string, string>,
      ).toString()
      fullUrl = query ? `${finalUrl}?${query}` : finalUrl
    } else {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/json',
      }
      fullUrl = finalUrl
    }

    const options = await augment(fetchOptions)
    fullUrl = `${options.baseURL ?? ''}${fullUrl}`

    const res = await fetch(fullUrl, {
      method: options.method,
      headers: options.headers,
      credentials: options.credentials,
      body: ['GET', 'DELETE'].includes(method!)
        ? undefined
        : JSON.stringify(requestPayload),
    })

    const isJson = res.headers
      .get('Content-Type')
      ?.includes('application/json')
    const data = isJson ? await res.json() : await res.text()

    return {
      ok: res.ok,
      status: res.status,
      data,
      headers: res.headers,
    }
  }

export const clientRequest = createRequest(async (opts) => {
  opts.baseURL = '/api'
  opts.credentials = 'include'
  return opts
})
