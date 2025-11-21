'use client'
import { createContext, useEffect, useState, useCallback } from 'react'
import { fetchUserClientCampaign } from 'helpers/fetchUserClientCampaign'
import { useUser } from '@shared/hooks/useUser'

type CampaignContextValue = [
  campaign: never | null,
  setCampaign: (campaign: never | null) => void,
  refreshCampaign: () => Promise<void>
]

export const CampaignContext = createContext<CampaignContextValue>([null, () => {}, async () => {}])

interface CampaignProviderProps {
  children: React.ReactNode
  campaign: never
}

export const CampaignProvider = ({ children, campaign: initCampaign }: CampaignProviderProps): React.JSX.Element => {
  const [campaign, setCampaign] = useState<never | null>(initCampaign)
  const [user] = useUser()

  const refreshCampaign = useCallback(async () => {
    const resp = await fetchUserClientCampaign()
    const respObj = resp as never
    const okValue = (respObj as { ok?: boolean }).ok
    const dataValue = (respObj as { data?: never }).data
    setCampaign(respObj && okValue === false ? null : (dataValue || null))
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

