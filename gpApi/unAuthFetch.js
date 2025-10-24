import { buildUrl } from '@shared/utils/buildUrl'

export const unAuthFetch = async (url, data, revalidate = 3600) => {
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

  // Check if response is ok and contains JSON
  if (!resp.ok) {
    console.error(`unAuthFetch error: ${resp.status} ${resp.statusText} for ${parsedUrl}`)
    return null
  }

  const contentType = resp.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    console.error(`unAuthFetch received non-JSON response for ${parsedUrl}`)
    return null
  }

  return await resp.json()
}