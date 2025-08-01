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
    if (typeof window === 'undefined') return

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

          const user =
            typeof analyticsInstance.user === 'function'
              ? analyticsInstance.user()
              : null

          let deviceId = null
          if (user && typeof user.anonymousId === 'function') {
            deviceId = user.anonymousId()
          }

          if (!deviceId) {
            console.warn(
              'Session Replay waiting for Segment anonymousId to be available. Device ID must match analytics events.',
            )
            return
          }

          console.log('Session Replay device ID (anonymousId):', deviceId)

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
        } catch (error) {
          console.error('Failed to initialize Session Replay:', error)
        }
      })()
    }

    if (!wantReplay && replayActive.current) {
      sessionReplay?.shutdown()?.finally(() => {
        replayActive.current = false
        window.sessionReplayInitialized = false
      })
    }
  }, [pathname])
  return null
}
