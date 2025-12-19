'use client'
import { useOnboardingContext } from '../../../contexts/OnboardingContext'
import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { PollPreview } from 'app/(candidate)/dashboard/polls/components/PollPreview'

export default function PreviewStep(): React.JSX.Element {
  const { demoMessageText, formData } = useOnboardingContext()
  const { imageUrl, scheduledDate } = formData

  useEffect(() => {
    trackEvent(EVENTS.ServeOnboarding.PollPreviewViewed)
  }, [])

  return (
    <div className="flex flex-col items-center md:justify-center mb-28 md:mb-4">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        Review your SMS poll
      </h1>
      <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground mb-8">
        This poll will be sent to a representative sample of your constituents
        for <b>FREE</b> and you&apos;ll be able to gather unbiased feedback in 3
        days.
      </p>
      <PollPreview
        scheduledDate={scheduledDate!}
        targetAudienceSize={500}
        imageUrl={imageUrl || undefined}
        message={demoMessageText}
        isFree={true}
      />
    </div>
  )
}






