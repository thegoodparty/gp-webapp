'use client'

import { Experiment } from '@amplitude/experiment-js-client'
import { getReadyAnalytics } from '@shared/utils/analytics'
import {
  useContext,
  useEffect,
  createContext,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { NEXT_PUBLIC_AMPLITUDE_API_KEY } from 'appEnv'

export const FeatureFlagsContext = createContext({
  ready: false,
  variant: () => ({ value: null }),
  all: () => ({}),
  exposure: () => {},
  refresh: async () => {},
  clear: () => {},
})

export const FeatureFlagsProvider = ({ children }) => {
  const clientRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [rev, setRev] = useState(0)

  const getUserContext = useCallback(async () => {
    const analytics = await getReadyAnalytics()
    let userId
    let deviceId
    let userProperties = {}

    const amplitudeUser =
      typeof analytics?.user === 'function' ? analytics.user() : null
    if (amplitudeUser) {
      if (typeof amplitudeUser.id === 'function') userId = amplitudeUser.id()
      if (typeof amplitudeUser.anonymousId === 'function')
        deviceId = amplitudeUser.anonymousId()
      if (typeof amplitudeUser.traits === 'function') {
        const traits = amplitudeUser.traits()
        if (traits) {
          userProperties = {
            email: traits.email,
            name: traits.name,
            phone: traits.phone,
            zip: traits.zip,
            ...traits,
          }
        }
      }
    }

    return {
      user_id: userId,
      device_id: deviceId,
      user_properties: userProperties,
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      const amplitudeUser = await getUserContext()
      await clientRef.current?.fetch(amplitudeUser)
      setRev((v) => v + 1)
    } catch (error) {
      console.warn('Experiment fetch failed: ', error)
    }
  }, [getUserContext])

  useEffect(() => {
    const key = NEXT_PUBLIC_AMPLITUDE_API_KEY
    if (!key) {
      console.warn('Experiment disabled: missing key')
      setReady(true)
      return
    }

    clientRef.current = Experiment.initialize(key, {
      automaticExposureTracking: true,
      exposureTrackingProvider: {
        track: async (exposure) => {
          try {
            const analytics = await getReadyAnalytics()
            if (analytics && typeof analytics.track === 'function') {
              analytics.track('$exposure', exposure)
            }
          } catch (error) {
            console.warn('Experiment exposure track failed: ', error)
          }
        },
      },
    })

    refresh().finally(() => setReady(true))
  }, [refresh])

  const value = useMemo(() => {
    const client = clientRef.current
    return {
      ready,
      variant: (key, fallback) =>
        client ? client.variant(key, fallback) : fallback ?? { value: null },
      all: () => (client ? client.all() : {}),
      exposure: (key) => client?.exposure(key),
      refresh,
      clear: () => client?.clear(),
    }
  }, [ready, refresh])

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export const useFeatureFlags = () => useContext(FeatureFlagsContext)
export const useFlagOn = (key) => {
  const { ready, variant } = useFeatureFlags()
  const v = variant(key, { value: 'off' })
  return { ready, on: ready && v?.value === 'on' }
}
