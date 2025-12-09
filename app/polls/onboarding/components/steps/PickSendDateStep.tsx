'use client'
import { PollScheduledDateSelector } from 'app/(candidate)/dashboard/polls/components/PollScheduledDateSelector'
import { useOnboardingContext } from 'app/polls/contexts'

export const PickSendDateStep: React.FC = () => {
  const { formData, updateFormData } = useOnboardingContext()
  return (
    <div className="flex flex-col items-center md:justify-center mb-28 md:mb-4">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        When should we send your poll?
      </h1>
      <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground">
        You can schedule polls up to 30 days in advance. GoodParty.org sends all
        polls at 11am local time to maximize responses.
      </p>
      <div className="w-full items-center flex flex-col gap-8 mt-8">
        <PollScheduledDateSelector
          scheduledDate={formData.scheduledDate}
          onChange={(date) => updateFormData({ scheduledDate: date })}
        />
      </div>
    </div>
  )
}
