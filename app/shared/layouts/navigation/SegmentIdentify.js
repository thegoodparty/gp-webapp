'use client'

import { useUser } from '@shared/hooks/useUser'
import { persistUtmsOnce } from 'helpers/analyticsHelper'
import { useSearchParams } from 'next/navigation'
import { getPersistedUtms } from 'helpers/analyticsHelper'
import { extractClids } from 'helpers/analyticsHelper'
import { useEffect } from 'react'
import { analytics } from '@shared/utils/analytics'

export default function SegmentIdentify({extraTraits = {}}) {
  const [user] = useUser()
  const searchParams = useSearchParams()
  useEffect(() => {

    if (!analytics || !analytics?.user || analytics.user().id()) return
    persistUtmsOnce()

    if (user?.id) {
      
      analytics.identify(user.id, {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        zip:   user.zip,
        ...extraTraits,
        ...getPersistedUtms(), 
        ...extractClids(searchParams) 
      })
    } else {
      analytics.identify({ ...extraTraits })
    }
  }, [user, searchParams, extraTraits, analytics])
}
