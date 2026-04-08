'use client'
import { createContext } from 'react'
import { Campaign } from 'helpers/types'
import { useQuery } from '@tanstack/react-query'
import { clientRequest } from 'gpApi/typed-request'
import { FetchError } from 'ofetch'

type CampaignContextValue = [campaign: Campaign | null]

export const CampaignContext = createContext<CampaignContextValue>([null])

interface CampaignProviderProps {
  children: React.ReactNode
  campaign: Campaign | null
}

export const CAMPAIGN_QUERY_KEY = ['campaign']

export const CampaignProvider = ({
  children,
  campaign: initCampaign,
}: CampaignProviderProps): React.JSX.Element => {
  const query = useQuery({
    queryKey: CAMPAIGN_QUERY_KEY,
    queryFn: async () => {
      try {
        const res = await clientRequest('GET /v1/campaigns/mine', {})
        return res.data
      } catch (e) {
        if (e instanceof FetchError && e.status === 404) return null
        throw e
      }
    },
    initialData: initCampaign ?? undefined,
  })

  return (
    <CampaignContext.Provider value={[query.data ?? null]}>
      {children}
    </CampaignContext.Provider>
  )
}
