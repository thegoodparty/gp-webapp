'use client'

import { trackEvent } from 'helpers/analyticsHelper'
import { useEffect } from 'react'

export default function TrackCantDownload({ campaign }) {
  useEffect(() => {
    trackEvent('Pro user can not download voter file page', {
      slug: campaign.slug,
    })
  }, [])
  return null
}
