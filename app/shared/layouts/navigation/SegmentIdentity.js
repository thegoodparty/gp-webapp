'use client'

import { useUser } from '@shared/hooks/useUser'

export default function SegmentIdentity() {
  const [user] = useUser()
  if (typeof analytics !== 'undefined' && user?.id) {
    analytics.identify(user.id, {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      zip: user.zip,
    })
  }
}
