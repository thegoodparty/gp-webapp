'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

type Props = { briefingId: string }

const resolveCameFrom = (utmSource: string | null): string => {
  if (utmSource === 'sms' || utmSource === 'email') return utmSource
  return 'direct'
}

const TrackBriefingViewed = ({ briefingId }: Props): null => {
  const searchParams = useSearchParams()
  const utmSource = searchParams?.get('utm_source') ?? null
  useEffect(() => {
    trackEvent(EVENTS.Briefings.BriefingViewed, {
      briefing_id: briefingId,
      came_from: resolveCameFrom(utmSource),
    })
  }, [briefingId, utmSource])
  return null
}

export default TrackBriefingViewed
