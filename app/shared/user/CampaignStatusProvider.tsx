'use client'
import { createContext, useEffect, useState } from 'react'
import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'

type CampaignStatusContextValue = [
  campaignStatus: Record<string, unknown> | null,
  setCampaignStatus: (status: Record<string, unknown> | null) => void
]

export const CampaignStatusContext = createContext<CampaignStatusContextValue>([null, () => {}])

interface CampaignStatusProviderProps {
  children: React.ReactNode
}

export const CampaignStatusProvider = ({ children }: CampaignStatusProviderProps): React.JSX.Element => {
  const [campaignStatus, setCampaignStatus] = useState<Record<string, unknown> | null>(null)
  const [campaign] = useCampaign()
  const [user] = useUser()

  useEffect(() => {
    const getStatus = async () => {
      const status = await fetchCampaignStatus()
      setCampaignStatus(status.ok === false ? null : status)
    }
    if (user) {
      getStatus()
    }
  }, [campaign, user])

  return (
    <CampaignStatusContext.Provider value={[campaignStatus, setCampaignStatus]}>
      {children}
    </CampaignStatusContext.Provider>
  )
}

