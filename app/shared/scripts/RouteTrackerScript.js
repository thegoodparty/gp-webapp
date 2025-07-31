'use client'

import {
  getPersistedClids,
  getPersistedUtms,
  persistClidsOnce,
  persistUtmsOnce,
} from 'helpers/analyticsHelper'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { analytics } from '@shared/utils/analytics'
import { useSearchParams } from 'next/navigation'

export default function RouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    persistUtmsOnce()
    persistClidsOnce()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const analyticsInstance = await analytics
        if (!analyticsInstance) return

        if (typeof analyticsInstance.ready === 'function') {
          await analyticsInstance.ready()
        }

        if (typeof analyticsInstance.page === 'function') {
          analyticsInstance.page(undefined, {
            ...getPersistedUtms(),
            ...getPersistedClids(),
          })
        }
      } catch (error) {
        console.error('Error tracking page:', error)
      }
    })()
  }, [pathname, searchParams])

  return null
}
