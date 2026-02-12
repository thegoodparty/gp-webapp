'use client'

import React, {
  ReactNode,
  useContext,
  useEffect,
  createContext,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react'
import {
  Experiment,
  ExperimentClient,
  Variant,
} from '@amplitude/experiment-js-client'
import { getReadyAnalytics } from '@shared/utils/analytics'
import { NEXT_PUBLIC_AMPLITUDE_API_KEY } from 'appEnv'

interface UserContext {
  user_id?: string
  device_id?: string
  user_properties?: Record<string, string | number | boolean>
}

interface FeatureFlagsContextValue {
  ready: boolean
  variant: (key: string, fallback?: Variant) => Variant
  all: () => Record<string, Variant>
  exposure: (key: string) => void
  refresh: () => Promise<void>
  clear: () => void
}

const defaultContextValue: FeatureFlagsContextValue = {
  ready: false,
  variant: () => ({ value: undefined }),
  all: () => ({}),
  exposure: () => {},
  refresh: async () => {},
  clear: () => {},
}

export const FeatureFlagsContext =
  createContext<FeatureFlagsContextValue>(defaultContextValue)

interface FeatureFlagsProviderProps {
  children: ReactNode
}

export const FeatureFlagsProvider = ({
  children,
}: FeatureFlagsProviderProps): React.JSX.Element => {
  const clientRef = useRef<ExperimentClient | null>(null)
  const [ready, setReady] = useState<boolean>(false)
  const [rev, setRev] = useState<number>(0)

  const getUserContext = useCallback(async (): Promise<UserContext> => {
    const analytics = await getReadyAnalytics()
    let userId: string | undefined
    let deviceId: string | undefined
    let userProperties: Record<string, string | number | boolean> = {}

    const amplitudeUser =
      typeof analytics?.user === 'function' ? analytics.user() : null
    if (amplitudeUser) {
      if (typeof amplitudeUser.id === 'function') {
        const id = amplitudeUser.id()
        userId = id ?? undefined
      }
      if (typeof amplitudeUser.anonymousId === 'function') {
        const id = amplitudeUser.anonymousId()
        deviceId = id ?? undefined
      }
      if (typeof amplitudeUser.traits === 'function') {
        const traits = amplitudeUser.traits()
        if (traits) {
          const rawProps = {
            email: traits.email,
            name: traits.name,
            phone: traits.phone,
            zip: traits.zip,
          }
          Object.entries(rawProps).forEach(([key, value]) => {
            if (
              value != null &&
              (typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean')
            ) {
              userProperties[key] = value
            }
          })
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

  const value = useMemo<FeatureFlagsContextValue>(() => {
    const client = clientRef.current
    return {
      ready,
      variant: (key: string, fallback?: Variant): Variant =>
        client
          ? client.variant(key, fallback)
          : fallback ?? { value: undefined },
      all: (): Record<string, Variant> => (client ? client.all() : {}),
      exposure: (key: string): void => client?.exposure(key),
      refresh,
      clear: (): void => client?.clear(),
    }
  }, [ready, refresh, rev])

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

export const useFeatureFlags = (): FeatureFlagsContextValue =>
  useContext(FeatureFlagsContext)

interface UseFlagOnResult {
  ready: boolean
  on: boolean
}

export const useFlagOn = (key: string): UseFlagOnResult => {
  const { ready, variant } = useFeatureFlags()
  const v = variant(key, { value: 'off' })
  return { ready, on: ready && v?.value === 'on' }
}
