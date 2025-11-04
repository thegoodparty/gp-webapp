'use client'

import { usePoll } from '../../../shared/hooks/PollProvider'
import { useRouter } from 'next/navigation'
import H1 from '@shared/typography/H1'
import { PurchaseIntentProvider } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { PURCHASE_TYPES } from 'helpers/purchaseTypes'
import { PurchaseStep } from './PurchaseStep'
import ExpandStepFooter from '../../expand/shared/ExpandStepFooter'
import ExpandPollLayout from '../../expand/shared/ExpandPollLayout'
import { useEffect } from 'react'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { completePurchase } from 'app/(candidate)/dashboard/purchase/utils/purchaseFetch.utils'

const PRICE_PER_TEXT = 0.03

export default function ExpandPaymentPage({ count }) {
  const [poll] = usePoll()
  const router = useRouter()

  const cost = (count * PRICE_PER_TEXT) / 100

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
    await completePurchase(paymentIntent.id)
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
      <H1 className="text-center">SMS Poll Payment</H1>
      <PurchaseIntentProvider
        type={PURCHASE_TYPES.POLL}
        purchaseMetaData={{
          count: parseInt(count, 10),
          pollId: poll.id,
        }}
      >
        <PurchaseStep onComplete={handlePurchaseComplete} />
      </PurchaseIntentProvider>
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
