'use client'
import { useEffect, useRef } from 'react'
import * as sessionReplay from '@amplitude/session-replay-browser'
import { analytics } from './utils/analytics'
import { getStoredSessionId, storeSessionId } from 'helpers/analyticsHelper'

export default function AnalyticsSessionReplayMiddleware() {
  const middlewareAttached = useRef(false)

  useEffect(() => {
    if (middlewareAttached.current) return
    ;(async () => {
      try {
        const analyticsInstance = await analytics
        if (!analyticsInstance) {
          console.warn('Analytics not available for middleware')
          return
        }

        if (typeof analyticsInstance.ready === 'function') {
          await analyticsInstance.ready()
        }

        middlewareAttached.current = true

        if (typeof analyticsInstance.addSourceMiddleware === 'function') {
          analyticsInstance.addSourceMiddleware(({ payload, next }) => {
            try {
              const storedSessionId = getStoredSessionId()
              const nextSessionId =
                payload.obj.integrations?.['Actions Amplitude']?.session_id || 0

              if (nextSessionId > 0 && storedSessionId < nextSessionId) {
                storeSessionId(nextSessionId)
                if (window.sessionReplayInitialized) {
                  try {
                    sessionReplay.setSessionId(nextSessionId)
                  } catch (err) {
                    console.warn('Failed to set session ID for replay:', err)
                  }
                }
              }
            } catch (error) {
              console.warn('Session ID middleware error:', error)
            }
            next(payload)
          })
        }

        if (typeof analyticsInstance.addSourceMiddleware === 'function') {
          analyticsInstance.addSourceMiddleware(({ payload, next }) => {
            try {
              if (payload.type() === 'track') {
                if (window.sessionReplayInitialized) {
                  try {
                    const sessionReplayProperties =
                      sessionReplay.getSessionReplayProperties()

                    if (
                      sessionReplayProperties &&
                      Object.keys(sessionReplayProperties).length > 0
                    ) {
                      payload.obj.properties = {
                        ...payload.obj.properties,
                        ...sessionReplayProperties,
                      }
                    }
                  } catch (replayError) {
                    console.warn(
                      'Failed to get session replay properties:',
                      replayError,
                    )
                  }
                }
              }
            } catch (error) {
              console.warn('Session Replay properties middleware error:', error)
            }
            next(payload)
          })
        }
      } catch (error) {
        console.error('Failed to set up analytics middleware:', error)
        middlewareAttached.current = false
      }
    })()
  }, [])
  return null
}
