'use client'

import { useUser } from '@shared/hooks/useUser'
import { persistUtmsOnce } from 'helpers/analyticsHelper'
import { useSearchParams } from 'next/navigation'
import { getPersistedUtms } from 'helpers/analyticsHelper'
import { extractClids } from 'helpers/analyticsHelper'
import { useEffect, useRef } from 'react'
import { identifyUser } from '@shared/utils/analytics'

const identify = async (user, searchParams) => {
  persistUtmsOnce()

  const traits = {
    ...getPersistedUtms(),
    ...extractClids(searchParams),
  }

  if (user?.id) {
    await identifyUser(user.id, {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      zip: user.zip,
      ...traits,
    })
  } else {
    await identifyUser(null, traits)
  }
}

export default function SegmentIdentify() {
  const [user] = useUser()
  const searchParams = useSearchParams()
  const lastIdentifiedUser = useRef(null)

  useEffect(() => {
    if (lastIdentifiedUser.current !== user?.id) {
      identify(user, searchParams)
      lastIdentifiedUser.current = user?.id
    }
  }, [user, searchParams])

  return null
}
