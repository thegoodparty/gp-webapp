'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { isProductRoute } from './utils/isProductRoute'
import { NEXT_PUBLIC_AMPLITUDE_API_KEY } from 'appEnv'
import * as sessionReplay from '@amplitude/session-replay-browser'
import { analytics } from './utils/analytics'
import { getStoredSessionId, storeSessionId } from 'helpers/analyticsHelper'

export default function AmplitudeInit() {
  const pathname = usePathname()
  const replayActive = useRef(false)

  useEffect(() => {
    if (!NEXT_PUBLIC_AMPLITUDE_API_KEY) {
      console.warn(
        'Amplitude API key not found. Analytics will not be initialized',
      )
      return
    }
    if (!analytics) return

    const wantReplay = isProductRoute(pathname)

    if (wantReplay && !replayActive.current) {
      ;(async () => {
        try {
          const analyticsInstance = await analytics
          if (!analyticsInstance) {
            console.warn('Analytics not available for Session Replay')
            return
          }

          if (typeof analyticsInstance.ready === 'function') {
            await analyticsInstance.ready()
          }

          let user = null
          let deviceId = null
          let attempts = 0
          const maxAttempts = 5

          while (attempts < maxAttempts && !deviceId) {
            user =
              typeof analyticsInstance.user === 'function'
                ? analyticsInstance.user()
                : null

            if (user) {
              deviceId =
                typeof user.anonymousId === 'function'
                  ? user.anonymousId()
                  : null

              const userId = typeof user.id === 'function' ? user.id() : null

              if (deviceId || userId) {
                deviceId = deviceId || userId
                console.log('Session Replay using device ID:', deviceId)
                break
              }
            }

            attempts++
            if (attempts < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 100))
            }
          }

          if (!deviceId) {
            const fallbackDeviceId = `fallback-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`

            console.log(
              'Session Replay using fallback device ID:',
              fallbackDeviceId,
            )
            deviceId = fallbackDeviceId
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
