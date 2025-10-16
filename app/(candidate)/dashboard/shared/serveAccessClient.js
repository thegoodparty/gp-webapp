import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

export default async function serveAccessClient() {
  const resp = await clientFetch(apiRoutes.electedOffice.current)
  return resp?.ok && resp?.data
}
