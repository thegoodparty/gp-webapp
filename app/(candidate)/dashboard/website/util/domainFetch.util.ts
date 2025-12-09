import { apiRoutes } from 'gpApi/routes'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'
import type { DomainSearchResponse } from 'types/prisma-models'
import type { JsonObject } from 'helpers/jsonTypes'

export function searchDomains(domain: string): Promise<ApiResponse<DomainSearchResponse>> {
  return clientFetch<DomainSearchResponse>(apiRoutes.domain.search, { domain })
}

export function deleteDomain(): Promise<ApiResponse<JsonObject | string>> {
  return clientFetch<JsonObject | string>(apiRoutes.domain.delete)
}
