'use client'

import { getPersistedUtms, persistUtmsOnce } from "helpers/analyticsHelper"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function RouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    persistUtmsOnce()
    if (window.analytics?.page) {
      const utms = getPersistedUtms()
      const clids = extractClids(searchParams)
      window.analytics.page(undefined, {...utms, ...clids})
    }
  }, [pathname, searchParams])

  return null
}