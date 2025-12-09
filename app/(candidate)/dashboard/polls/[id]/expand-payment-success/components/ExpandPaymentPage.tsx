'use client'

import ExpandPollLayout from '../../expand/shared/ExpandPollLayout'
import { PollPaymentSuccess } from '../../../shared/components/PollPaymentSuccess'

export default function ExpandPaymentSuccessPage({ count }: { count: number }) {
  const nextWeekDate = new Date()
  nextWeekDate.setDate(nextWeekDate.getDate() + 7)

  return (
    <ExpandPollLayout showBreadcrumbs={false}>
      <PollPaymentSuccess
        className="flex flex-col items-center justify-center"
        scheduledDate={nextWeekDate}
        textsPaidFor={count}
        redirectTo={'/dashboard/polls'}
      />
    </ExpandPollLayout>
  )
}
