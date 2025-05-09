'use client'

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function RouteTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.analytics?.page) {
      window.analytics.page()
    }
  }, [pathname])

  return null
}