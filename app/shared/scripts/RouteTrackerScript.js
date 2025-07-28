'use client'

import { getPersistedClids, getPersistedUtms, persistClidsOnce, persistUtmsOnce } from "helpers/analyticsHelper"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { analytics } from "@shared/utils/analytics"
import { useSearchParams } from "next/navigation"

export default function RouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    persistUtmsOnce()
    persistClidsOnce()
  }, [])

  useEffect(() => {
    analytics.page(undefined, { 
      ...getPersistedUtms(), 
      ...getPersistedClids() 
    })
  }, [pathname, searchParams]) // We only want to run this when the pathname changes

  return null
}