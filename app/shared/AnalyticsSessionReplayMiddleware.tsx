'use client'
import { useEffect, useRef } from 'react'
import * as sessionReplay from '@amplitude/session-replay-browser'
import { getReadyAnalytics } from './utils/analytics'
import { getStoredSessionId, storeSessionId } from 'helpers/analyticsHelper'

declare global {
  interface Window {
    sessionReplayInitialized?: boolean
  }
}

export default function AnalyticsSessionReplayMiddleware(): null {
  const middlewareAttached = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (middlewareAttached.current) return
    ;(async () => {
      try {
        const analyticsInstance = await getReadyAnalytics()
        if (!analyticsInstance) {
          console.warn('Analytics not available for middleware')
          return
        }

        middlewareAttached.current = true

        if (typeof analyticsInstance.addSourceMiddleware === 'function') {
          analyticsInstance.addSourceMiddleware(({ payload, next }) => {
            try {
              const storedSessionId = getStoredSessionId()
              const amplitudeIntegration = payload.obj.integrations?.['Actions Amplitude']
              const nextSessionId =
                (amplitudeIntegration && typeof amplitudeIntegration === 'object' && 'session_id' in amplitudeIntegration
                  ? (amplitudeIntegration as { session_id?: number }).session_id
                  : undefined) || 0

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

                try {
                  const user = analyticsInstance.user()
                  if (user && typeof user.anonymousId === 'function') {
                    const anonymousId = user.anonymousId()
                    if (anonymousId) {
                      if (!payload.obj.integrations) {
                        payload.obj.integrations = {}
                      }
                      const amplitudeIntegration = payload.obj.integrations['Actions Amplitude']
                      if (!amplitudeIntegration || typeof amplitudeIntegration !== 'object') {
                        payload.obj.integrations['Actions Amplitude'] = {}
                      }
                      const integration = payload.obj.integrations['Actions Amplitude']
                      if (integration && typeof integration === 'object') {
                        (integration as Record<string, unknown>).device_id = anonymousId
                      }
                    }
                  }
                } catch (deviceIdError) {
                  console.warn(
                    'Failed to set device ID for Amplitude:',
                    deviceIdError,
                  )
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
