'use client'
import { createContext } from 'react'
import { Campaign } from 'helpers/types'
import { useQuery } from '@tanstack/react-query'
import { clientRequest } from 'gpApi/typed-request'

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
    queryFn: () =>
      clientRequest('GET /v1/campaigns/mine', {}).then((res) => res.data),
    initialData: initCampaign ?? undefined,
  })

  return (
    <CampaignContext.Provider value={[query.data ?? null]}>
      {children}
    </CampaignContext.Provider>
  )
}
