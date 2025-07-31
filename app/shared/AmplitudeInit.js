'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { isProductRoute } from './utils/isProductRoute'
import { NEXT_PUBLIC_AMPLITUDE_API_KEY } from 'appEnv'
import * as sessionReplay from '@amplitude/session-replay-browser'
import { getAnalytics } from './utils/analytics'
import { getStoredSessionId, storeSessionId } from 'helpers/analyticsHelper'

export default function AmplitudeInit() {
  const pathname = usePathname()
  const replayActive = useRef(false)
  const initPromise = useRef(null)

  useEffect(() => {
    if (!NEXT_PUBLIC_AMPLITUDE_API_KEY) {
      console.warn(
        'Amplitude API key not found. Analytics will not be initialized',
      )
      return
    }

    const wantReplay = isProductRoute(pathname)

    if (wantReplay && !replayActive.current && !initPromise.current) {
      initPromise.current = (async () => {
        try {
          const analytics = await getAnalytics()
          if (!analytics) {
            console.warn(
              'Analytics not available. Session Replay will not be initialized',
            )
            return
          }

          await analytics.ready()

          const user = await analytics.user()
          if (!user) {
            console.warn('Analytics user not available')
            return
          }

          let sessionId = getStoredSessionId()
          if (!sessionId || sessionId <= 0) {
            sessionId = Date.now()
            storeSessionId(sessionId)
          }

          // Ensure session ID is a number as required by Amplitude
          sessionId = Number(sessionId)

          const deviceId = user.anonymousId()
          if (!deviceId) {
            console.warn('Device ID not available from analytics')
            return
          }

          await sessionReplay.init(NEXT_PUBLIC_AMPLITUDE_API_KEY, {
            sessionId,
            deviceId,
            sampleRate: 1,
          }).promise

          replayActive.current = true

          // Signal that Session Replay is initialized
          window.sessionReplayInitialized = true
        } catch (error) {
          console.error('Failed to initialize Session Replay:', error)
          initPromise.current = null
        }
      })()
    }

    if (!wantReplay && replayActive.current) {
      sessionReplay.shutdown().finally(() => {
        replayActive.current = false
        initPromise.current = null
        window.sessionReplayInitialized = false
      })
    }
  }, [pathname])

  return null
}
