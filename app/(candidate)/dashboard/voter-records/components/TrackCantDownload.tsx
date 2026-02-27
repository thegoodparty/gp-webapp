'use client'

import { trackEvent } from 'helpers/analyticsHelper'
import { useEffect } from 'react'

interface TrackCantDownloadProps {
  campaign: {
    slug?: string
  } | null
}

export default function TrackCantDownload({
  campaign,
}: TrackCantDownloadProps): null {
  useEffect(() => {
    trackEvent('Pro user can not download voter file page', {
      slug: campaign?.slug,
    })
  }, [])
  return null
}
