'use client'

import { useUser } from '@shared/hooks/useUser'
import { persistUtmsOnce } from 'helpers/analyticsHelper'
import { useSearchParams } from 'next/navigation'
import { getPersistedUtms } from 'helpers/analyticsHelper'
import { extractClids } from 'helpers/analyticsHelper'
import { useEffect } from 'react'
import { identifyUser } from '@shared/utils/analytics'
import { User } from 'helpers/types'

const identify = async (
  user: User | null,
  searchParams: ReturnType<typeof useSearchParams>,
) => {
  persistUtmsOnce()

  const traits = {
    ...getPersistedUtms(),
    ...extractClids(searchParams as URLSearchParams),
  }

  if (user?.id) {
    const userTraits = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || undefined,
      zip: user.zip || undefined,
      ...traits,
    }
    await identifyUser(user.id, userTraits)
  } else {
    await identifyUser(null, traits)
  }
}

const SegmentIdentify = (): null => {
  const [user] = useUser()
  const searchParams = useSearchParams()

  useEffect(() => {
    identify(user, searchParams)
  }, [user, searchParams])

  return null
}

export default SegmentIdentify
