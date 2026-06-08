'use client'
import { createContext, useMemo } from 'react'
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

// Shared so consumers can observe the same campaign query (deduped by key)
// rather than redefining the fetch. A 404 means "no campaign yet" (null);
// other errors propagate so callers can show a recoverable error state.
export const fetchCampaign = async (): Promise<Campaign | null> => {
  try {
    const res = await clientRequest('GET /v1/campaigns/mine', {})
    return res.data
  } catch (e) {
    if (e instanceof FetchError && e.status === 404) return null
    throw e
  }
}

export const CampaignProvider = ({
  children,
  campaign: initCampaign,
}: CampaignProviderProps): React.JSX.Element => {
  const query = useQuery({
    queryKey: CAMPAIGN_QUERY_KEY,
    queryFn: fetchCampaign,
    initialData: initCampaign ?? undefined,
  })

  const campaign = query.data ?? null
  const contextValue = useMemo<CampaignContextValue>(
    () => [campaign],
    [campaign],
  )

  return (
    <CampaignContext.Provider value={contextValue}>
      {children}
    </CampaignContext.Provider>
  )
}
