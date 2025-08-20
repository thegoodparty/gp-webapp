'use client'
import { Experiment } from "@amplitude/experiment-js-client"
import {
  NEXT_PUBLIC_AMPLITUDE_API_KEY,
} from 'appEnv'
import { getReadyAnalytics } from "@shared/utils/analytics"

let client

export function getExperimentClient() {
  if (!client) {
    const key = NEXT_PUBLIC_AMPLITUDE_API_KEY
    if (!key) {
      console.warn('Experiment disabled: missing key')
      return
    }
    client = Experiment.initialize(NEXT_PUBLIC_AMPLITUDE_API_KEY, {
      automaticExposureTracking: true,
      exposureTrackingProvider: {
        track: async (exposure) => {
          try {
            const analytics = await getReadyAnalytics()
            analytics?.track('$exposure', exposure)
          } catch (error) {
            console.warn('Exposure track failed', error)
          }
        }
      }
    })
  }
  return client
}

export async function fetchVariantsWithSegmentIdentity() {
  const analytics = await getReadyAnalytics()
  let userId
  let deviceId

    const user = typeof analytics?.user === 'function' ? analytics.user() : null
    if (user) {
      if (typeof user.id === 'function') userId = user.id()
      if (typeof user.anonymousId === 'function') deviceId = user.anonymousId()
    }
    await getExperimentClient().fetch({ user_id: userId, device_id: deviceId })
}