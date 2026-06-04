'use client'
import { createContext, useEffect, useMemo, useState } from 'react'
import { noop } from '@shared/utils/noop'
import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'

interface CampaignStatus {
  status: boolean | string
  [key: string]: string | boolean | number | null | undefined
}

type CampaignStatusContextValue = [
  campaignStatus: CampaignStatus | null,
  setCampaignStatus: (status: CampaignStatus | null) => void,
]

export const CampaignStatusContext = createContext<CampaignStatusContextValue>([
  null,
  noop,
])

interface CampaignStatusProviderProps {
  children: React.ReactNode
}

export const CampaignStatusProvider = ({
  children,
}: CampaignStatusProviderProps): React.JSX.Element => {
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus | null>(
    null,
  )
  const [campaign] = useCampaign()
  const [user] = useUser()

  useEffect(() => {
    const getStatus = async () => {
      const status = await fetchCampaignStatus()
      setCampaignStatus(
        (status as { ok?: boolean }).ok === false
          ? null
          : (status as CampaignStatus),
      )
    }
    if (user) {
      getStatus()
    }
  }, [campaign, user])

  const contextValue = useMemo<CampaignStatusContextValue>(
    () => [campaignStatus, setCampaignStatus],
    [campaignStatus],
  )

  return (
    <CampaignStatusContext.Provider value={contextValue}>
      {children}
    </CampaignStatusContext.Provider>
  )
}
