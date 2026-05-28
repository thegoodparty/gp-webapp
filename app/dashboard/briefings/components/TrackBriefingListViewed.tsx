'use client'

import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

const TrackBriefingListViewed = (): null => {
  useEffect(() => {
    trackEvent(EVENTS.BriefingAssistant.ListViewed)
  }, [])
  return null
}

export default TrackBriefingListViewed
