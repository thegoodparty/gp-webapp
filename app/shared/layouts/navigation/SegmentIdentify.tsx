'use client'

import { useUser } from '@shared/hooks/useUser'
import { persistUtmsOnce } from 'helpers/analyticsHelper'
import { useSearchParams } from 'next/navigation'
import { getPersistedUtms } from 'helpers/analyticsHelper'
import { extractClids } from 'helpers/analyticsHelper'
import { useEffect } from 'react'
import { identifyUser } from '@shared/utils/analytics'
import { buildUserTraits } from 'helpers/buildUserTraits'
import { User } from 'helpers/types'

const identify = async (
  user: User | null,
  searchParams: ReturnType<typeof useSearchParams>,
) => {
  persistUtmsOnce()

  const traits = {
    ...getPersistedUtms(),
    ...(searchParams ? extractClids(searchParams) : {}),
  }

  if (user?.id) {
    const userTraits = {
      ...buildUserTraits(user),
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
