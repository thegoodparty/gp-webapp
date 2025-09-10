'use client'
import { createContext, useMemo, useState, useContext, useEffect } from 'react'
import { useCampaign } from '@shared/hooks/useCampaign'
import {
  isP2pUxEnabled,
  p2pCutoffDatetime,
} from 'app/(candidate)/dashboard/components/tasks/flows/util/isP2pUxEnabled.util'

export const P2pUxEnabledContext = createContext({
  p2pCutoffDatetime: null,
  proUpdatedAtDate: null,
  p2pUxEnabled: false,
  resetP2pUxEnabled: () => {},
})
export const P2pUxEnabledProvider = ({ children }) => {
  const [campaign] = useCampaign()
  const { details: campaignDetails } = campaign || {}
  const { isProUpdatedAt } = campaignDetails || {}
  const proUpdatedAtDate = new Date(isProUpdatedAt)
  const [p2pUxEnabled, setP2pUxEnabled] = useState(
    isP2pUxEnabled(proUpdatedAtDate),
  )

  useEffect(() => {
    setP2pUxEnabled(isP2pUxEnabled(proUpdatedAtDate))
  }, [proUpdatedAtDate])

  const resetP2pUxEnabled = useMemo(
    () => () => setP2pUxEnabled(isP2pUxEnabled(proUpdatedAtDate)),
    [proUpdatedAtDate],
  )

  return (
    <P2pUxEnabledContext.Provider
      value={{
        resetP2pUxEnabled,
        p2pCutoffDatetime,
        proUpdatedAtDate,
        p2pUxEnabled,
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
