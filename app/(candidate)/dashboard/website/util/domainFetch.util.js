import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

export function searchDomains(domain) {
  return clientFetch(apiRoutes.domain.search, { domain })
}

export function deleteDomain() {
  return clientFetch(apiRoutes.domain.delete)
}
