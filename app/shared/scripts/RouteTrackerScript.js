'use client'

import { getPersistedClids, getPersistedUtms, persistClidsOnce, persistUtmsOnce } from "helpers/analyticsHelper"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAnalytics } from "@shared/hooks/useAnalytics"

export default function RouteTracker() {
  const analytics = useAnalytics()
  const pathname = usePathname()

  useEffect(() => {
    persistUtmsOnce()
    persistClidsOnce()
  }, [])

  useEffect(() => {
    if (!analytics?.page) return
    analytics.page(undefined, { 
      ...getPersistedUtms(), 
      ...getPersistedClids() 
    })
  }, [pathname, analytics]) // We only want to run this when the pathname changes

  return null
}