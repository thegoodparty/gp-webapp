import { ELECTION_API_ROOT } from 'appEnv'

export function unAuthElectionFetch<T>(
  path: string,
  data?: object,
  revalidate?: number
): Promise<T>
export async function unAuthElectionFetch<T>(
  path: string,
  data: object = {},
  revalidate = 3600,
): Promise<T> {
  const entries: [string, string][] = []
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      entries.push([key, String(value)])
    }
  }
  const qs = entries.length > 0 ? `?${new URLSearchParams(entries)}` : ''
  const url = `${ELECTION_API_ROOT}/v1${path}${qs}`
  const resp = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate },
  })
  return resp.json()
}
export default unAuthElectionFetch
