'use client'
import { createContext, useEffect, useState, useCallback } from 'react'
import { fetchUserClientCampaign } from 'helpers/fetchUserClientCampaign'
import { useUser } from '@shared/hooks/useUser'

export const CampaignContext = createContext([null, () => {}])

export const CampaignProvider = ({ children, campaign: initCampaign }) => {
  const [campaign, setCampaign] = useState(initCampaign)
  const [user] = useUser()

  const refreshCampaign = useCallback(async () => {
    const resp = await fetchUserClientCampaign()
    setCampaign(!resp.ok ? null : resp.data)
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
