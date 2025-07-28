'use client'
import { useEffect, useRef } from "react"
import * as sessionReplay from '@amplitude/session-replay-browser'
import { analytics } from "./utils/analytics"
import { getStoredSessionId, storeSessionId } from "helpers/analyticsHelper"

export default function AnalyticsSessionReplayMiddleware() {
  const middlewareAttached = useRef(false)

  useEffect(() => {
    if (middlewareAttached.current) return

    (async () => {
      await analytics.ready()
      middlewareAttached.current = true

      analytics.addSourceMiddleware(({ payload, next }) => {
        const storedSessionId = getStoredSessionId()
        const nextSessionId = payload.obj.integrations?.['Actions Amplitude']?.session_id || 0

        if (storedSessionId < nextSessionId) {
          storeSessionId(nextSessionId)
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
    })()
  }, [analytics])
  return null
}