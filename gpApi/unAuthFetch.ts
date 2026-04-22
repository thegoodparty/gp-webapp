import { buildUrl } from '@shared/utils/buildUrl'

/**
 * Fetches a public (unauthenticated) endpoint. Unlike `clientRequest` and
 * `serverRequest`, this helper attaches no cookies and no Authorization header,
 * so the request reaches gp-api as anonymous. Do NOT migrate calls off this
 * helper to `clientRequest` / `serverRequest` without confirming the endpoint
 * should accept authenticated traffic — those helpers always send credentials.
 */
export const unAuthFetch = async <T = unknown>(
  url: string,
  data?: Record<string, unknown>,
  revalidate: number = 3600,
): Promise<T> => {
  const parsedUrl = buildUrl(
    {
      path: url,
      method: 'GET',
    },
    data,
  )
  const resp = await fetch(parsedUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate },
  })

  return (await resp.json()) as T
}
