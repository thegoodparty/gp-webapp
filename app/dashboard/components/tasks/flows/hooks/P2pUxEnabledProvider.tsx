'use client'
import { createContext, useContext, useMemo, ReactNode } from 'react'
import { noop } from '@shared/utils/noop'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useTcrComplianceCheck } from 'app/dashboard/components/tasks/flows/hooks/useTcrComplianceCheck'

interface P2pUxEnabledContextValue {
  proUpdatedAtDate: Date
  p2pUxEnabled: boolean
  tcrCompliant: boolean
  resetP2pUxEnabled: () => void
}

export const P2pUxEnabledContext = createContext<P2pUxEnabledContextValue>({
  proUpdatedAtDate: new Date(),
  p2pUxEnabled: false,
  tcrCompliant: false,
  resetP2pUxEnabled: noop,
})

interface P2pUxEnabledProviderProps {
  children: ReactNode
}

export const P2pUxEnabledProvider = ({
  children,
}: P2pUxEnabledProviderProps) => {
  const [campaign] = useCampaign()
  const [tcrCompliant] = useTcrComplianceCheck()
  const { details: campaignDetails } = campaign || {}
  const { isProUpdatedAt } = campaignDetails || {}

  const contextValue = useMemo<P2pUxEnabledContextValue>(
    () => ({
      resetP2pUxEnabled: noop,
      proUpdatedAtDate: new Date(isProUpdatedAt || ''),
      p2pUxEnabled: true,
      tcrCompliant,
    }),
    [isProUpdatedAt, tcrCompliant],
  )

  return (
    <P2pUxEnabledContext.Provider value={contextValue}>
      {children}
    </P2pUxEnabledContext.Provider>
  )
}

export const useP2pUxEnabled = () => {
  const context = useContext(P2pUxEnabledContext)
  if (!context) {
    throw new Error('useP2pUxEnabled must be used within P2pUxEnabledProvider')
  }
  return context
}
