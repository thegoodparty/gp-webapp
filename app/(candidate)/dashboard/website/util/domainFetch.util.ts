import { apiRoutes } from 'gpApi/routes'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'

export function searchDomains(domain: string): Promise<ApiResponse> {
  return clientFetch(apiRoutes.domain.search, { domain })
}

export function deleteDomain(): Promise<ApiResponse> {
  return clientFetch(apiRoutes.domain.delete)
}
