'use client'

import { useUser } from '@shared/hooks/useUser'
import { persistUtmsOnce } from 'helpers/analyticsHelper'
import { useSearchParams } from 'next/navigation'
import { getPersistedUtms } from 'helpers/analyticsHelper'
import { extractClids } from 'helpers/analyticsHelper'
import { useEffect } from 'react'
import { analytics } from '@shared/utils/analytics'

const identify = async (user, searchParams) => {
  try {
    const analyticsInstance = await analytics
    if (!analyticsInstance) return

    if (typeof analyticsInstance.ready === 'function') {
      await analyticsInstance.ready()
    }

    const analyticsUser =
      typeof analyticsInstance.user === 'function'
        ? analyticsInstance.user()
        : null

    if (
      analyticsUser &&
      ((typeof analyticsUser.id === 'function' && analyticsUser.id()) ||
        (typeof analyticsUser.anonymousId === 'function' &&
          analyticsUser.anonymousId()))
    ) {
      return // No need to spam identity calls that have no new information
    }

    persistUtmsOnce()

    const traits = {
      ...getPersistedUtms(),
      ...extractClids(searchParams),
    }

    if (typeof analyticsInstance.identify === 'function') {
      if (user?.id) {
        analyticsInstance.identify(user.id, {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          zip: user.zip,
          ...traits,
        })
      } else {
        analyticsInstance.identify(traits)
      }
    }
  } catch (error) {
    console.error('Error identifying user:', error)
  }
}

export default function SegmentIdentify() {
  const [user] = useUser()
  const searchParams = useSearchParams()

  useEffect(() => {
    identify(user, searchParams)
  }, [user, searchParams])

  return null
}
