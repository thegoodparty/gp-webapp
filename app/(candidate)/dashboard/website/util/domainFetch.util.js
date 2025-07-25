import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

export function searchDomains(domain) {
  return clientFetch(apiRoutes.domain.search, { domain })
}

export function registerDomain(domain) {
  return clientFetch(apiRoutes.domain.register, { domain })
}

export function completeRegistration() {
  return clientFetch(apiRoutes.domain.completeRegistration)
}

export function deleteDomain() {
  return clientFetch(apiRoutes.domain.delete)
}

export function getDomainStatus() {
  return clientFetch(apiRoutes.domain.status)
}
