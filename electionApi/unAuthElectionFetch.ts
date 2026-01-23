import { ELECTION_API_ROOT } from 'appEnv'

export const unAuthElectionFetch = async (
  path,
  data = {},
  revalidate = 3600,
) => {
  const qs = Object.keys(data).length ? `?${new URLSearchParams(data)}` : ''
  const url = `${ELECTION_API_ROOT}/v1${path}${qs}`
  const resp = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate },
  })
  return resp.json()
}
export default unAuthElectionFetch
