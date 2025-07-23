'use client'
import { useEffect, useRef } from "react"
import * as sessionReplay from '@amplitude/session-replay-browser'
import { useAnalytics } from "./hooks/useAnalytics"
import { getStoredSessionId, setSessionId } from "helpers/analyticsHelper"

export default function AnalyticsSessionReplayMiddleware() {
  const analytics = useAnalytics()
  const middlewareAttached = useRef(false)

  useEffect(() => {
    if (!analytics || middlewareAttached.current) return

    (async () => {
      await analytics.ready()
      middlewareAttached.current = true

      analytics.addSourceMiddleware(({ payload, next }) => {
        setTimeout(() => {
          const storedSessionId = getStoredSessionId()
          const nextSessionId = payload.obj.integrations?.['Actions Amplitude']?.session_id || 0
          console.log('nextSessionId: ', nextSessionId)
  
          if (storedSessionId < nextSessionId) {
            setSessionId(nextSessionId)
            sessionReplay.setSessionId(nextSessionId)
          }
        }, 0)
        next(payload)
      })

      analytics.addSourceMiddleware(({ payload, next }) => {
        const sessionReplayProperties = sessionReplay.getSessionReplayProperties()
        console.log('sessionReplayProperties: ', sessionReplayProperties)
        if (payload.type() === 'track') {
          payload.obj.properties = {
            ...payload.obj.properties,
            ...sessionReplayProperties,
          }
        }
        next(payload)
      })
    })()
  }, [analytics])
  return null
}