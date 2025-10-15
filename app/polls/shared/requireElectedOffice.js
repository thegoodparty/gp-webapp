import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { redirect } from 'next/navigation'

export default async function requireElectedOffice() {
  const resp = await serverFetch(apiRoutes.electedOffice.current)
  if (!resp?.ok || !resp?.data) {
    return redirect('/dashboard')
  }
  return resp.data
}
