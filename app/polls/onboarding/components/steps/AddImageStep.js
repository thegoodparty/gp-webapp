'use client'
import { useState, useEffect } from 'react'
import { useOnboardingContext } from '../../../contexts/OnboardingContext'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { PollImageUpload } from 'app/(candidate)/dashboard/polls/components/PollImageUpload'

export default function AddImageStep({}) {
  const { setImageUrl } = useOnboardingContext()

  const [localImageUrl, setLocalImageUrl] = useState(null)

  // Fire view event once on mount
  useEffect(() => {
    trackEvent(EVENTS.ServeOnboarding.AddImageViewed)
  }, [])

  const handleUpload = async (imageUrl) => {
    setLocalImageUrl(imageUrl)
    // Store in onboarding context
    setImageUrl(imageUrl)

    trackEvent(EVENTS.ServeOnboarding.PollImageUploaded)
  }

  return (
    <div className="flex flex-col items-center md:justify-center mb-28 md:mb-4">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        Text messages perform better with an image.
      </h1>
      <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground w-full">
        Add your campaign headshot, logo or a community photo for credibility.
      </p>

      <PollImageUpload imageUrl={localImageUrl} onUploaded={handleUpload} />
    </div>
  )
}
