'use client'
import { createContext, useEffect, useState } from 'react'
import { fetchUserClientCampaign } from 'helpers/fetchUserClientCampaign'
import { useUser } from '@shared/hooks/useUser'

export const CampaignContext = createContext([null, () => {}])

export const CampaignProvider = ({ children }) => {
  const [campaign, setCampaign] = useState(null)
  const [user] = useUser()

  const refreshCampaign = async () => {
    const campaign = await fetchUserClientCampaign()
    setCampaign(campaign?.ok && campaign.ok === false ? null : campaign)
  }

  useEffect(() => {
    const getCampaign = async () => {
      const campaign = await fetchUserClientCampaign()
      setCampaign(campaign?.ok && campaign.ok === false ? null : campaign)
    }
    if (user) {
      getCampaign()
    }
  }, [user])

  return (
    <CampaignContext.Provider value={[campaign, setCampaign, refreshCampaign]}>
      {children}
    </CampaignContext.Provider>
  )
}
