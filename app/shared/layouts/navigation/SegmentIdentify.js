'use client'

import { useUser } from '@shared/hooks/useUser'
import { persistUtmsOnce } from 'helpers/analyticsHelper'
import { useSearchParams } from 'next/navigation'
import { getPersistedUtms } from 'helpers/analyticsHelper'
import { extractClids } from 'helpers/analyticsHelper'
import { useEffect } from 'react'
import { useAnalytics } from '@shared/hooks/useAnalytics'

export default function SegmentIdentify({extraTraits = {}}) {
  const analytics = useAnalytics()
  const [user] = useUser()
  const searchParams = useSearchParams()
  useEffect(() => {
     
    typeof window !== 'undefined' && console.log('window.analytics is: ', analytics)

    if (!analytics || !analytics?.user || analytics.user().id()) return
    console.log('analytics.user(): ', analytics.user())
    persistUtmsOnce()

    console.log('foobar')
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
