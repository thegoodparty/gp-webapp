'use client'

import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

type Props = { briefingId: string }

const TrackBriefingViewed = ({ briefingId }: Props): null => {
  useEffect(() => {
    trackEvent(EVENTS.BriefingAssistant.BriefingViewed, { briefingId })
  }, [briefingId])
  return null
}

export default TrackBriefingViewed
