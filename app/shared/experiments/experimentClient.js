'use client'
import { Experiment } from "@amplitude/experiment-js-client"
import {
  NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_DEPLOYMENT_KEY,
} from 'appEnv'
import { getReadyAnalytics } from "@shared/utils/analytics"

let client

export function getExperimentClient() {
  if (!client) {
    const deploymentKey = NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_DEPLOYMENT_KEY

    client = Experiment.initialize(deploymentKey, {
      automaticExposureTracking: true,
      exposureTrackingProvider: {
        track: async (exposure) => {
          try {
            const analytics = await getReadyAnalytics()
            analytics.track('$exposure', exposure)
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

  try {
    const user =
    typeof analytics.user === 'function'
      ? analytics.user()
      : null

    let deviceId = null
    if (user && typeof user.anonymousId === 'function') {
      deviceId = user.anonymousId()
    }

    if (!deviceId) {
      console.warn(
        'Amplitude Experiment waiting for Segment anonymousId to be available. Device ID must match analytics events.',
      )
      return
    }
  } catch (error) {
    console.warn('Failed to initialize Amplitude Experiment: ', error)
  }

  await getExperimentClient().fetch({
    user_id: userId,
    device_id, deviceId,
  })
}