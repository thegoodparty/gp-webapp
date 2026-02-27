import { buildUrl } from '@shared/utils/buildUrl'

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
