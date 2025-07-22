'use client'
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { isProductRoute } from "./utils/isProductRoute"
import { NEXT_PUBLIC_AMPLITUDE_API_KEY } from "appEnv"
import * as sessionReplay from "@amplitude/session-replay-browser"
import { useAnalytics } from "./hooks/useAnalytics"
import { getStoredSessionId } from "helpers/analyticsHelper"

export default async function AmplitudeInit() {
  const analytics = useAnalytics()
  const pathname = usePathname()

  useEffect(() => {
    if (!NEXT_PUBLIC_AMPLITUDE_API_KEY) {
      console.warn('Amplitude API key not found. Analytics will not be initialized')
      return
    }
    if (isProductRoute(pathname)) {
      analytics.ready(async() => {
        const user = await analytics.user()
        const storedSessionId = getStoredSessionId()
  
        await sessionReplay.init(NEXT_PUBLIC_AMPLITUDE_API_KEY, {
          sessionId: storedSessionId,
          deviceId: user.anonymousId()
        }).promise
      })

      // initAll(NEXT_PUBLIC_AMPLITUDE_API_KEY, {
      //   sessionReplay: {
      //     sampleRate: 1 // Can be overridden remotely in Amplitude
      //   },
      // })
    }
  }, [pathname, analytics])
  return null
}
