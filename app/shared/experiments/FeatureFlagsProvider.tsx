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
  const flag = flags[key]
  const tracked = useRef(false)

  useEffect(() => {
    if (flag === undefined || tracked.current) return
    tracked.current = true

    getReadyAnalytics().then((analytics) => {
      if (analytics) {
        analytics.track('$exposure', {
          flag_key: key,
          variant: flag,
        })
      }
    })
  }, [key, flag])

  if (flag === undefined) return false
  return flag === 'on'
}
