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
  const [retryCount, setRetryCount] = useState(0)
  const [shouldRetry, setShouldRetry] = useState(false)

  useEffect(() => {
    const key = NEXT_PUBLIC_AMPLITUDE_API_KEY
    if (!key) {
      console.warn('Experiment disabled: missing key')
      setReady(true)
      return
    }
    clientRef.current = Experiment.initialize(NEXT_PUBLIC_AMPLITUDE_API_KEY, {
      automaticExposureTracking: true,
      exposureTrackingProvider: {
        track: async (exposure) => {
          try {
            const analytics = await getReadyAnalytics()
            if (analytics && typeof analytics.track === 'function')
              analytics.track('$exposure', exposure)
          } catch (error) {
            console.warn('Experiment exposure track failed: ', error)
          }
        },
      },
    })

    refresh().finally(() => setReady(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!shouldRetry || retryCount >= 3) return

    const timeoutId = setTimeout(() => {
      setShouldRetry(false)
      refresh()
    }, retryCount * 1000)

    return () => clearTimeout(timeoutId)
  }, [shouldRetry, retryCount, refresh])

  const refresh = useCallback(async () => {
    try {
      const analytics = await getReadyAnalytics()
      let userId
      let deviceId
      let userProperties = {}

      if (!analytics && retryCount < 3) {
        setRetryCount((prev) => prev + 1)
        setShouldRetry(true)
        return
      }

      const user =
        typeof analytics?.user === 'function' ? analytics.user() : null

      if (user) {
        if (typeof user.id === 'function') userId = user.id()
        if (typeof user.anonymousId === 'function')
          deviceId = user.anonymousId()
        if (typeof user.traits === 'function') {
          const traits = user.traits()
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

      const fetchParams = {
        user_id: userId,
        device_id: deviceId,
        user_properties: userProperties,
      }

      await clientRef.current?.fetch(fetchParams)
      setRev((v) => v + 1)
    } catch (error) {
      console.warn('Experiment fetch failed: ', error)
    }
  }, [retryCount])

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
