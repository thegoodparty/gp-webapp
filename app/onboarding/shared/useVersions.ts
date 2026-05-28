'use client'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export type CampaignVersions = Partial<
  Record<string, string | number | boolean | object | null>
>

export const campaignVersionsQueryOptions = queryOptions({
  queryKey: ['campaign', 'plan-version'] as const,
  queryFn: async (): Promise<CampaignVersions> => {
    const res = await clientFetch<CampaignVersions>(
      apiRoutes.campaign.planVersion,
    )
    if (!res.ok) {
      throw new Error(
        `Failed to fetch campaign versions (${res.status} ${res.statusText})`,
      )
    }
    return res.data
  },
})

export default function useVersions() {
  return useQuery(campaignVersionsQueryOptions)
}
