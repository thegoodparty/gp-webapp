'use client'
import { MessageCard } from '../MessageCard'
import TextMessagePreview from '@shared/text-message-previews/TextMessagePreview'
import Image from 'next/image'
import { useOnboardingContext } from '../../../contexts/OnboardingContext'
import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

export default function PreviewStep() {
  const { demoMessageText, formData } = useOnboardingContext()
  const { imageUrl } = formData

  useEffect(() => {
    trackEvent(EVENTS.ServeOnboarding.PollPreviewViewed)
  }, [])

  return (
    <div className="flex flex-col items-center md:justify-center mb-28 md:mb-4">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        Review your SMS poll
      </h1>
      <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground">
        This serve will be sent to a representative sample of your constituents for <b>FREE</b> and you&apos;ll be able to gather unbiased feedback in 3 days.
      </p>

      <div className="w-full items-center flex flex-col gap-4 mt-8">

        <MessageCard
          title="Outreach Summary"
          description={
            <div className="flex flex-col gap-1">
              <ul className="mb-1">
                <li className="leading-normal medium text-sm">500 Recipients</li>
                <li className="leading-normal medium text-sm">Timeline: 3 Days</li>
                <li className="leading-normal medium text-sm">Cost: <b>FREE</b></li>
              </ul>
              <div className="max-w-xs mx-auto">
                <TextMessagePreview message={
                  <div className="flex flex-col gap-2">
                    {imageUrl ? (
                      <Image src={imageUrl} alt="Campaign image" width={300} height={300} className="object-cover rounded" />
                    ) : (
                      <Image src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg" alt="Grand Rapids City Council Member Farhad" width={300} height={300} />
                    )}
                    <p className="mt-1 font-normal">{demoMessageText}</p>
                  </div>
                } />
              </div>
              {/* TODO: Add send yourself a test button. We will do that once we have the real text message API */}
              {/* <Button size="small" variant="ghost" className="text-blue-500 my-2">Send yourself a test</Button> */}
            </div>
          }
          note="You can add more recipients after launch."
        />

      </div>
    </div>
  )
}
