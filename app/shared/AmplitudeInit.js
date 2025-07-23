'use client'
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { isProductRoute } from "./utils/isProductRoute"
import { NEXT_PUBLIC_AMPLITUDE_API_KEY } from "appEnv"
import * as sessionReplay from "@amplitude/session-replay-browser"
import { useAnalytics } from "./hooks/useAnalytics"
import { getStoredSessionId } from "helpers/analyticsHelper"

export default function AmplitudeInit() {
  const analytics = useAnalytics()
  const pathname = usePathname()
  const replayActive = useRef(false)

  useEffect(() => {
    if (!NEXT_PUBLIC_AMPLITUDE_API_KEY) {
      console.warn('Amplitude API key not found. Analytics will not be initialized')
      return
    }
    if (!analytics) return

    const wantReplay = isProductRoute(pathname)

    if (wantReplay && !replayActive.current) {
      (async () => {
        await analytics.ready()
      
          const user = await analytics.user()
          const storedSessionId = getStoredSessionId()
          console.log('storedSessionId: ', storedSessionId)
    
          await sessionReplay.init(NEXT_PUBLIC_AMPLITUDE_API_KEY, {
            sessionId: storedSessionId,
            deviceId: user.anonymousId(),
            sampleRate: 1, // Can be overridden in Amplitude
        }).promise
        replayActive.current = true
      })()
    }

    if (!wantReplay && replayActive.current) {
      sessionReplay.shutdown().finally(() => {
        replayActive.current = false
      })
    }
  }, [pathname, analytics])
  return null
}
