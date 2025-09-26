'use client'
import { Button } from 'goodparty-styleguide'
import { MessageCard } from '../MessageCard'
import TextMessagePreview from '@shared/text-message-previews/TextMessagePreview'

export default function PreviewStep({ demoText }) {

  return (
    <div className="flex flex-col items-center md:justify-center sm:h-screen md:h-auto mb-8">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        Review your SMS serve
      </h1>
      <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground">
        This serve will be sent to a representative sample of your constituents for <b>FREE</b> and you'll be able to gather unbiased feedback in 3 days.
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
                    <img src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg" alt="Grand Rapids City Council Member Farhad" />
                    <p className="mt-1">{demoText}</p>
                  </div>
                } />
              </div>
              <Button size="small" variant="ghost" className="text-blue-500 my-2">Send yourself a test</Button>
            </div>
          }
          note="You can add more recipients after launch."
        />

      </div>
    </div>
  )
}
