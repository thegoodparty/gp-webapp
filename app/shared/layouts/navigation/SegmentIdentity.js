'use client'

import { useUser } from '@shared/hooks/useUser'

export default function SegmentIdentity(extraTraits = {}) {
  const [user] = useUser()

  if (typeof analytics == 'undefined' || !user?.id) return

  const alreadyAliased = window.sessionStorage.getItem('SEGMENT_ALIAS_DONE')
  if (!alreadyAliased) {
    analytics.alias(user.id)
    window.sessionStorage.setItem('SEGMENT_ALIAS_DONE', '1')
  }

  analytics.identify(user.id, {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    zip: user.zip,
    ...extraTraits
  })
}
