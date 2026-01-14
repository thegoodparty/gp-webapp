'use client'
import { createContext, useMemo, useState, useContext, useEffect, ReactNode } from 'react'
import { useCampaign } from '@shared/hooks/useCampaign'
import {
  isP2pUxEnabled,
  p2pCutoffDatetime,
} from 'app/(candidate)/dashboard/components/tasks/flows/util/isP2pUxEnabled.util'
import { useTcrComplianceCheck } from 'app/(candidate)/dashboard/components/tasks/flows/hooks/useTcrComplianceCheck'

interface P2pUxEnabledContextValue {
  p2pCutoffDatetime: Date
  proUpdatedAtDate: Date
  p2pUxEnabled: boolean
  tcrCompliant: boolean
  resetP2pUxEnabled: () => void
}

export const P2pUxEnabledContext = createContext<P2pUxEnabledContextValue>({
  p2pCutoffDatetime: p2pCutoffDatetime,
  proUpdatedAtDate: new Date(),
  p2pUxEnabled: false,
  tcrCompliant: false,
  resetP2pUxEnabled: () => {},
})

interface P2pUxEnabledProviderProps {
  children: ReactNode
}

export const P2pUxEnabledProvider = ({ children }: P2pUxEnabledProviderProps) => {
  const [campaign] = useCampaign()
  const [tcrCompliant] = useTcrComplianceCheck()
  const { details: campaignDetails } = campaign || {}
  const { isProUpdatedAt } = campaignDetails || {}
  const proUpdatedAtDate = new Date(isProUpdatedAt || '')
  const [p2pUxEnabled, setP2pUxEnabled] = useState(
    isP2pUxEnabled(proUpdatedAtDate, tcrCompliant),
  )

  useEffect(() => {
    setP2pUxEnabled(isP2pUxEnabled(proUpdatedAtDate, tcrCompliant))
  }, [proUpdatedAtDate, tcrCompliant])

  const resetP2pUxEnabled = useMemo(
    () => () => setP2pUxEnabled(isP2pUxEnabled(proUpdatedAtDate, tcrCompliant)),
    [proUpdatedAtDate, tcrCompliant],
  )

  return (
    <P2pUxEnabledContext.Provider
      value={{
        resetP2pUxEnabled,
        p2pCutoffDatetime,
        proUpdatedAtDate,
        p2pUxEnabled,
        tcrCompliant,
      }}
    >
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
