'use client'

import {
  getPersistedClids,
  getPersistedUtms,
  persistClidsOnce,
  persistUtmsOnce,
} from 'helpers/analyticsHelper'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPage } from '@shared/utils/analytics'
import { useSearchParams } from 'next/navigation'

export default function RouteTracker(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    persistUtmsOnce()
    persistClidsOnce()
  }, [])

  useEffect(() => {
    const clids = getPersistedClids()
    const filteredClids = Object.fromEntries(
      Object.entries(clids).filter(([, value]) => value !== null),
    ) as Record<string, string>

    trackPage(undefined, {
      ...getPersistedUtms(),
      ...filteredClids,
    })
  }, [pathname, searchParams])

  return null
}
