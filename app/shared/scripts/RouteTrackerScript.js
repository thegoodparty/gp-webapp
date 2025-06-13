'use client'

import { getPersistedClids, getPersistedUtms, persistClidsOnce, persistUtmsOnce } from "helpers/analyticsHelper"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAnalytics } from "@shared/hooks/useAnalytics"

export default function RouteTracker() {
  console.log('RouteTracker called')
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
    console.log('Finish analytics.page() call')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, analytics]) // We only want to run this when the pathname changes

  return null
}