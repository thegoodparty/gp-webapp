'use client'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { clientRequest } from 'gpApi/typed-request'
import type { CampaignVersions } from 'helpers/types'

export type { CampaignVersions } from 'helpers/types'

export const campaignVersionsQueryOptions = queryOptions({
  queryKey: ['campaign', 'plan-version'] as const,
  queryFn: async (): Promise<CampaignVersions> => {
    const { data } = await clientRequest(
      'GET /v1/campaigns/mine/plan-version',
      {},
    )
    return data
  },
})

export default function useVersions() {
  return useQuery(campaignVersionsQueryOptions)
}
