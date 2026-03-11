'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import { getReadyAnalytics } from '@shared/utils/analytics'
import type { ServerFlags } from './serverFeatureFlags'

const FeatureFlagsContext = createContext<ServerFlags>({})

export const FeatureFlagsProvider = ({
  flags,
  children,
}: {
  flags: ServerFlags
  children: React.ReactNode
}) => (
  <FeatureFlagsContext.Provider value={flags}>
    {children}
  </FeatureFlagsContext.Provider>
)

export const useFlagOn = (key: string) => {
  const flags = useContext(FeatureFlagsContext)
  const value = flags[key] === 'on'
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) {
      return
    }
    tracked.current = true

    getReadyAnalytics().then((analytics) => {
      if (analytics) {
        analytics.track('$exposure', {
          flag_key: key,
          variant: value ? 'on' : 'off',
        })
      }
    })
  }, [key, value])

  return value
}
