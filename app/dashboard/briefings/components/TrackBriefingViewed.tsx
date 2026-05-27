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
  useEffect(() => {
    trackEvent(EVENTS.Briefings.BriefingViewed, {
      briefing_id: briefingId,
      came_from: resolveCameFrom(searchParams.get('utm_source')),
    })
  }, [briefingId, searchParams])
  return null
}

export default TrackBriefingViewed
