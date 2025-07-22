'use client'
import { useEffect } from "react"
import * as sessionReplay from '@amplitude/session-replay-browser'
import { useAnalytics } from "./hooks/useAnalytics"
import { getStoredSessionId, setSessionId } from "@amplitude/session-replay-browser"

export default function AmplitudeSessionReplayMiddleware() {
  const analytics = useAnalytics()

  useEffect(() => {
    if (!analytics) return

    analytics.ready(() => {
      analytics.addSourceMiddleware(({ payload, next }) => {
        const storedSessionId = getStoredSessionId()
        const nextSessionId = payload.obj.integrations?.['Actions Amplitude']?.session_id || 0

        if (storedSessionId < nextSessionId) {
          setSessionId(nextSessionId)
          sessionReplay.setSessionId(nextSessionId)
        }
        next(payload)
      })

      analytics.addSourceMiddleware(({ payload, next }) => {
        const sessionReplayProperties = sessionReplay.getSessionReplayProperties()

        if (payload.type() === 'track') {
          payload.obj.properties = {
            ...payload.obj.properties,
            ...sessionReplayProperties,
          }
        }
        next(payload)
      })
    })
  }, [analytics])
  return null
}