'use client'

import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import DateInputCalendar from '@shared/inputs/DateInputCalendar'
import { useOnboardingContext } from '../../../contexts/OnboardingContext'

export default function SwornInStep() {
  const { setSwornInDate, formData } = useOnboardingContext()
  useEffect(() => {
    trackEvent(EVENTS.ServeOnboarding.SwornInViewed)
  }, [])

  return (
    <div className="flex flex-col items-center md:justify-center mb-28 md:mb-4">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        Before we get started, when do you get sworn into office?
      </h1>

      <div className="mt-8 mb-2">
        <DateInputCalendar
          value={formData.swornInDate}
          onChange={setSwornInDate}
          label="Select Date"
          placeholder="mm/dd/yyyy"
          captionLayout="dropdown"
        />
      </div>
    </div>
  )
}
