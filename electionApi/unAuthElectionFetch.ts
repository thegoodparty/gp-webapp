import { ELECTION_API_ROOT } from 'appEnv'

export const unAuthElectionFetch = async <T = unknown>(
  path: string,
  data: Record<string, string | number | boolean> = {},
  revalidate = 3600,
): Promise<T> => {
  const stringifiedData: Record<string, string> = {}
  for (const [key, value] of Object.entries(data)) {
    stringifiedData[key] = String(value)
  }
  const qs = Object.keys(stringifiedData).length ? `?${new URLSearchParams(stringifiedData)}` : ''
  const url = `${ELECTION_API_ROOT}/v1${path}${qs}`
  const resp = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate },
  })
  return resp.json()
}
export default unAuthElectionFetch
