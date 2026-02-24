import { APIEndpoints } from 'gpApi/api-endpoints'
import { PathParamsOf } from 'gpApi/typed-request'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, beforeAll, beforeEach } from 'vitest'

export type APIMockerResponse<T> =
  | {
      status: 200
      data: T
      headers?: Record<string, string>
    }
  | {
      status: 400 | 401 | 403 | 404 | 500
      data: any
      headers?: Record<string, string>
    }

type MockRequestHandler<Route extends keyof APIEndpoints> = (
  // prettier-ignore
  request:
  & {
      headers: Record<string, string | undefined>;
      params: PathParamsOf<Route>;
    }
  & (Route extends (`GET ${string}` | `DELETE ${string}`)
    ? { query: APIEndpoints[Route]['Request'] }
    : { body: APIEndpoints[Route]['Request'] }),
) =>
  | APIMockerResponse<APIEndpoints[Route]['Response']>
  | Promise<APIMockerResponse<APIEndpoints[Route]['Response']>>

type MockFunction = <Route extends keyof APIEndpoints & string>(
  route: Route,
  handlerOrResponse:
    | APIMockerResponse<APIEndpoints[Route]['Response']>
    | MockRequestHandler<Route>,
) => APIMocker

export type APIMocker = {
  /**
   * Persistently mocks the specified `route` using the provided handler or
   * static response.
   */
  mock<Route extends keyof APIEndpoints & string>(
    route: Route,
    handlerOrResponse:
      | APIMockerResponse<APIEndpoints[Route]['Response']>
      | MockRequestHandler<Route>,
  ): APIMocker

  /**
   * Mocks a series of ordered responses on the specified `route`. Each of
   * the responses will be returned exactly once, in the order they were
   * provided.
   *
   * @example
   *
   * api.mockOrdered(
   *   'GET /something',
   *   [
   *     { status: 200, data: { value: 'one' } },
   *     { status: 200, data: { value: 'two' } },
   *     { status: 200, data: { value: 'three' } },
   *   ]
   * );
   *
   * const res1 = await client.get('/something'); // { value: 'one' }
   * const res2 = await client.get('/something'); // { value: 'two' }
   * const res3 = await client.get('/something'); // { value: 'three' }
   */
  mockOrdered<Route extends keyof APIEndpoints & string>(
    route: Route,
    handlerOrResponse: (
      | APIMockerResponse<APIEndpoints[Route]['Response']>
      | MockRequestHandler<Route>
    )[],
  ): APIMocker

  reset: () => void
}

const toMSWResponse = (response: APIMockerResponse<any>) =>
  HttpResponse.json(response.data, {
    status: response.status,
    headers: response.headers,
  })

const createMocker =
  (
    server: ReturnType<typeof setupServer>,
    baseUrl: string,
    api: APIMocker,
    options: { once: boolean },
  ): MockFunction =>
  (route, handlerOrResponse) => {
    const [method, url] = route.split(' ')

    const lowercaseMethod = method!.toLowerCase() as
      | 'get'
      | 'delete'
      | 'put'
      | 'patch'
      | 'post'

    server.use(
      http[lowercaseMethod](
        `${baseUrl}${url}`,
        async ({ request, params }) => {
          if (typeof handlerOrResponse !== 'function') {
            return toMSWResponse(handlerOrResponse)
          }

          const headersRecord: Record<string, string | undefined> = {}
          request.headers.forEach((value, key) => {
            headersRecord[key] = value
          })

          const mockRequest = {
            headers: headersRecord,
            params: params as PathParamsOf<typeof route>,
          }

          let mockedResponse: APIMockerResponse<
            APIEndpoints[typeof route]['Response']
          >

          if (['get', 'delete'].includes(lowercaseMethod)) {
            const query: Record<string, string> = {}
            const searchParams = new URL(request.url).searchParams
            for (const [key, value] of searchParams.entries()) {
              query[key] = value
            }
            // @ts-expect-error TypeScript isn't smart enough to narrow down
            // the GET/DELETE case here.
            mockedResponse = await handlerOrResponse({
              ...mockRequest,
              query,
            })
          } else {
            const body = await request.json()
            // @ts-expect-error TypeScript isn't smart enough to narrow down
            // the GET/DELETE case here.
            mockedResponse = await handlerOrResponse({
              ...mockRequest,
              body,
            })
          }

          return toMSWResponse(mockedResponse)
        },
        { once: options.once },
      ),
    )

    return api
  }

const server = setupServer()
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})
beforeEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

const baseUrl = '/api'
const api = {} as APIMocker
api.mock = createMocker(server, baseUrl, api, { once: false })
const mockOnce = createMocker(server, baseUrl, api, { once: true })
api.mockOrdered = (route, handlerOrResponses) => {
  // msw's behavior is the opposite of what we want here: they return _later_
  // mocks first. So, reverse this array to get the behavior we want.
  for (const handlerOrResponse of handlerOrResponses.concat().reverse()) {
    mockOnce(route, handlerOrResponse)
  }
  return api
}
api.reset = () => server.resetHandlers()

export { api }
