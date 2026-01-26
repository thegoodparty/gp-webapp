import { apiRoutes } from 'gpApi/routes'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'

interface DomainSuggestion {
  DomainName: string
  price?: number
}

export interface DomainSearchResults {
  domainName: string
  availability: string
  price?: number
  suggestions?: DomainSuggestion[]
}

export function searchDomains(domain: string): Promise<ApiResponse<DomainSearchResults>> {
  return clientFetch<DomainSearchResults>(apiRoutes.domain.search, { domain })
}

export function deleteDomain(): Promise<ApiResponse> {
  return clientFetch(apiRoutes.domain.delete)
}
