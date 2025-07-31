'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { isProductRoute } from './utils/isProductRoute'
import { NEXT_PUBLIC_AMPLITUDE_API_KEY } from 'appEnv'
import * as sessionReplay from '@amplitude/session-replay-browser'
import { getReadyAnalytics } from './utils/analytics'
import { getStoredSessionId, storeSessionId } from 'helpers/analyticsHelper'

export default function AmplitudeInit() {
  const pathname = usePathname()
  const replayActive = useRef(false)

  useEffect(() => {
    if (!NEXT_PUBLIC_AMPLITUDE_API_KEY) {
      console.warn(
        'Amplitude API key not found. Session Replay will not be initialized',
      )
      return
    }

    const wantReplay = isProductRoute(pathname)

    if (wantReplay && !replayActive.current) {
      ;(async () => {
        try {
          const analyticsInstance = await getReadyAnalytics()
          if (!analyticsInstance) {
            console.warn('Analytics not available for Session Replay')
            return
          }

          // Get user and device ID (no retry needed after analytics.ready())
          const user =
            typeof analyticsInstance.user === 'function'
              ? analyticsInstance.user()
              : null

          let deviceId = null

          if (user) {
            // Try to get device ID (anonymous ID first, then user ID as backup)
            deviceId =
              typeof user.anonymousId === 'function' ? user.anonymousId() : null

            if (!deviceId && typeof user.id === 'function') {
              deviceId = user.id()
            }
          }

          // If no device ID available, generate fallback
          if (!deviceId) {
            deviceId = `fallback-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`
          }

          let sessionId = getStoredSessionId()
          if (!sessionId || sessionId <= 0) {
            sessionId = Date.now()
            storeSessionId(sessionId)
          }

          await sessionReplay.init(NEXT_PUBLIC_AMPLITUDE_API_KEY, {
            sessionId: Number(sessionId),
            deviceId,
            sampleRate: 1,
          }).promise

          replayActive.current = true
          window.sessionReplayInitialized = true
          console.log('Session Replay initialized successfully')
        } catch (error) {
          console.error('Failed to initialize Session Replay:', error)
        }
      })()
    }

    if (!wantReplay && replayActive.current) {
      sessionReplay.shutdown().finally(() => {
        replayActive.current = false
        window.sessionReplayInitialized = false
      })
    }
  }, [pathname])
  return null
}
