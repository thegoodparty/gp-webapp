'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useUser } from '@shared/hooks/useUser'
import { isSessionReplayRoute } from './utils/isSessionReplayRoute'
import { NEXT_PUBLIC_AMPLITUDE_API_KEY } from 'appEnv'
import * as sessionReplay from '@amplitude/session-replay-browser'
import { getReadyAnalytics } from './utils/analytics'
import { getStoredSessionId, storeSessionId } from 'helpers/analyticsHelper'

declare global {
  interface Window {
    sessionReplayInitialized?: boolean
  }
}

const AmplitudeInit = (): null => {
  const pathname = usePathname()
  const [user] = useUser()
  const replayActive = useRef<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!NEXT_PUBLIC_AMPLITUDE_API_KEY) {
      console.warn(
        'Amplitude API key not found. Session Replay will not be initialized',
      )
      return
    }

    let cancelled = false
    const wantReplay = isSessionReplayRoute(pathname) && !!user

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

          let deviceId: string | null | undefined = null
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

          if (cancelled) {
            ;(sessionReplay?.shutdown() as Promise<void> | undefined)?.catch(
              () => {},
            )
            return
          }

          replayActive.current = true
          window.sessionReplayInitialized = true
        } catch (error) {
          console.error('Failed to initialize Session Replay:', error)
        }
      })()
    }

    if (!wantReplay && replayActive.current) {
      ;(sessionReplay?.shutdown() as Promise<void> | undefined)?.finally(() => {
        replayActive.current = false
        window.sessionReplayInitialized = false
      })
    }

    return () => {
      cancelled = true
    }
  }, [pathname, user])
  return null
}

export default AmplitudeInit
