'use client'
import { useOnboardingContext } from '../../../contexts/OnboardingContext'
import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import PreviewCard from '../PreviewCard'

export default function PreviewStep() {
  const { demoMessageText, formData } = useOnboardingContext()
  const { imageUrl, estimatedCompletionDate } = formData

  useEffect(() => {
    trackEvent(EVENTS.ServeOnboarding.PollPreviewViewed)
  }, [])

  return (
    <div className="flex flex-col items-center md:justify-center mb-28 md:mb-4">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        Review your SMS poll
      </h1>
      <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground">
        This poll will be sent to a representative sample of your constituents
        for <b>FREE</b> and you&apos;ll be able to gather unbiased feedback in 3
        days.
      </p>
      <PreviewCard
        count={500}
        timeline="3 Days"
        cost="FREE"
        demoMessageText={demoMessageText}
        imageUrl={imageUrl}
        estimatedCompletionDate={estimatedCompletionDate}
      />
    </div>
  )
}

