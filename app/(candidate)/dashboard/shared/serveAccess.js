import { redirect } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

export default async function serveAccess() {
  // don't remove this call. It prevents the build process to try to cache this page which should be dynamic
  // https://nextjs.org/docs/messages/dynamic-server-error
  const resp = await serverFetch(apiRoutes.electedOffice.current)
  if (!resp?.ok || !resp?.data) {
    return redirect('/dashboard')
  }
}
