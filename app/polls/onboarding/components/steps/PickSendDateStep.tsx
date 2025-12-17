'use client'
import {
  POLLS_SCHEDULING_COPY,
  PollScheduledDateSelector,
} from 'app/(candidate)/dashboard/polls/components/PollScheduledDateSelector'
import { useOnboardingContext } from 'app/polls/contexts'

export const PickSendDateStep: React.FC = () => {
  const { formData, setScheduledDate } = useOnboardingContext()
  return (
    <div className="flex flex-col items-center md:justify-center mb-28 md:mb-4">
      <h1 className="text-left md:text-center font-semibold text-2xl md:text-4xl w-full">
        When should we send your poll?
      </h1>
      <p className="text-left md:text-center mt-4 text-lg font-normal text-muted-foreground">
        {POLLS_SCHEDULING_COPY}
      </p>
      <div className="w-full items-center flex flex-col gap-8 mt-8">
        <PollScheduledDateSelector
          scheduledDate={formData.scheduledDate || undefined}
          onChange={(date) => setScheduledDate(date)}
        />
      </div>
    </div>
  )
}
