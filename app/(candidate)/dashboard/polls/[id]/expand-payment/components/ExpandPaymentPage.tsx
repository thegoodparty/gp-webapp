'use client'

import { usePoll } from '../../../shared/hooks/PollProvider'
import { useRouter } from 'next/navigation'
import ExpandStepFooter from '../../expand/shared/ExpandStepFooter'
import ExpandPollLayout from '../../expand/shared/ExpandPollLayout'
import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { PRICE_PER_POLL_TEXT } from '../../../shared/constants'
import {
  PollPurchaseType,
  PollPayment,
} from '../../../shared/components/PollPayment'

export type ExpandPaymentPageProps = {
  count: number
  scheduledDate: string
}

export default function ExpandPaymentPage({
  count,
  scheduledDate,
}: ExpandPaymentPageProps) {
  const [poll] = usePoll()
  const router = useRouter()

  const cost = count * PRICE_PER_POLL_TEXT

  useEffect(() => {
    trackEvent(EVENTS.expandPolls.paymentViewed, {
      type: 'Serve Poll Expansion',
      count,
      cost,
    })
  }, [])

  const params = `count=${count}&scheduledDate=${encodeURIComponent(
    scheduledDate,
  )}`

  const handleBack = () => {
    router.push(`/dashboard/polls/${poll.id}/expand-review?${params}`)
  }

  const handlePurchaseComplete = () => {
    trackEvent(EVENTS.expandPolls.paymentCompleted, {
      type: 'Serve Poll Expansion',
      cost,
      count,
    })
    router.push(`/dashboard/polls/${poll.id}/expand-payment-success?${params}`)
  }

  return (
    <ExpandPollLayout>
      <PollPayment
        purchaseMetaData={{
          pollPurchaseType: PollPurchaseType.expansion,
          count,
          pollId: poll.id,
          scheduledDate,
        }}
        onConfirmed={handlePurchaseComplete}
      />
      <ExpandStepFooter
        currentStep={4}
        onBack={handleBack}
        hideNext
        hideBack
        disabledNext
        onNext={() => {}}
        onNextText=""
      />
    </ExpandPollLayout>
  )
}
