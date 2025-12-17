import { redirect } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

export default async function serveAccess(): Promise<void> {
  const resp = await serverFetch(apiRoutes.electedOffice.current)
  if (!resp?.ok || !resp?.data) {
    return redirect('/dashboard')
  }
}


