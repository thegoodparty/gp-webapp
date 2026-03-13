'use client'
import { createContext, useEffect, useState, useCallback } from 'react'
import { fetchUserClientCampaign } from 'helpers/fetchUserClientCampaign'
import { useUser } from '@shared/hooks/useUser'
import { Campaign } from 'helpers/types'

type CampaignContextValue = [
  campaign: Campaign | null,
  setCampaign: (campaign: Campaign | null) => void,
  refreshCampaign: () => Promise<void>,
]

export const CampaignContext = createContext<CampaignContextValue>([
  null,
  () => {},
  async () => {},
])

interface CampaignProviderProps {
  children: React.ReactNode
  campaign: Campaign | null
}

export const CampaignProvider = ({
  children,
  campaign: initCampaign,
}: CampaignProviderProps): React.JSX.Element => {
  const [campaign, setCampaign] = useState<Campaign | null>(initCampaign)
  const [user] = useUser()

  const refreshCampaign = useCallback(async () => {
    const resp = await fetchUserClientCampaign()
    if (resp && typeof resp === 'object' && 'ok' in resp) {
      setCampaign(resp.ok === false ? null : (resp.data as Campaign))
    } else {
      setCampaign(null)
    }
  }, [])

  useEffect(() => {
    if (user) {
      refreshCampaign()
    }
  }, [user, refreshCampaign])

  return (
    <CampaignContext.Provider value={[campaign, setCampaign, refreshCampaign]}>
      {children}
    </CampaignContext.Provider>
  )
}
