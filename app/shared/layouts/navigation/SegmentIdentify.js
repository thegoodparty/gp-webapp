'use client'

import { useUser } from '@shared/hooks/useUser'
import { persistUtmsOnce } from 'helpers/analyticsHelper'
import { useSearchParams } from 'next/navigation'
import { getPersistedUtms } from 'helpers/analyticsHelper'
import { extractClids } from 'helpers/analyticsHelper'
import { useEffect } from 'react'
import { identifyUser } from '@shared/utils/analytics'
import { useFeatureFlags } from '@shared/experiments/FeatureFlagsProvider'

const identify = async (user, searchParams, refreshFeatureFlags) => {
  persistUtmsOnce()

  const traits = {
    ...getPersistedUtms(),
    ...extractClids(searchParams),
  }

  if (user?.id) {
    const userTraits = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      zip: user.zip,
      ...traits,
    }
    await identifyUser(user.id, userTraits)

    // Refresh feature flags after user identification
    setTimeout(() => refreshFeatureFlags?.(), 1000)
  } else {
    await identifyUser(null, traits)
  }
}

export default function SegmentIdentify() {
  const [user] = useUser()
  const searchParams = useSearchParams()
  const { refresh } = useFeatureFlags()

  useEffect(() => {
    identify(user, searchParams, refresh)
  }, [user, searchParams, refresh])

  return null
}
