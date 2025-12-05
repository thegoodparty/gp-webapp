'use client'

import { usePoll } from '../../../shared/hooks/PollProvider'
import { useRouter } from 'next/navigation'
import ExpandStepFooter from '../../expand/shared/ExpandStepFooter'
import ExpandPollLayout from '../../expand/shared/ExpandPollLayout'
import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { PRICE_PER_POLL_TEXT } from '../../../shared/constants'
import { PollPayment } from '../../../shared/components/PollPayment'

export default function ExpandPaymentPage({ count }) {
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

  const handleBack = () => {
    router.push(`/dashboard/polls/${poll.id}/expand-review?count=${count}`)
  }

  const handlePurchaseComplete = async (paymentIntent) => {
    trackEvent(EVENTS.expandPolls.paymentCompleted, {
      type: 'Serve Poll Expansion',
      cost,
      count,
    })
    router.push(
      `/dashboard/polls/${poll.id}/expand-payment-success?count=${count}`,
    )
  }

  return (
    <ExpandPollLayout>
      <PollPayment
        metadata={{
          type: 'expansion',
          count: parseInt(count, 10),
          pollId: poll.id,
        }}
        onConfirmed={handlePurchaseComplete}
      />
      <ExpandStepFooter
        currentStep={3}
        onBack={handleBack}
        hideNext
        hideBack
        disabledNext
        disabledBack
      />
    </ExpandPollLayout>
  )
}
