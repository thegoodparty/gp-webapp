'use client'

import { useUser } from '@shared/hooks/useUser'
import { persistUtmsOnce } from 'helpers/analyticsHelper'
import { useSearchParams } from 'next/navigation'
import { getPersistedUtms } from 'helpers/analyticsHelper'
import { extractClids } from 'helpers/analyticsHelper'
import { useEffect } from 'react'
import { analytics } from '@shared/utils/analytics'

export default function SegmentIdentify() {
  const [user] = useUser()
  const searchParams = useSearchParams()
  useEffect(() => {

    if (!analytics) return
    (async () => {
      const analyticsUser = await analytics.user()
      if (analyticsUser.id() || analyticsUser.anonymousId()) return // No need to spam identity calls that have no new information

      persistUtmsOnce()

      user?.id 
      ? analytics.identify(user.id, {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          zip:   user.zip,
          ...getPersistedUtms(), 
          ...extractClids(searchParams) 
        })
      : analytics.identify()
    })()
  }, [user, searchParams, analytics])
}
