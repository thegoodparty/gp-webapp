import { useEffect, useRef } from 'react'
import { useCheckoutSession } from 'app/(candidate)/dashboard/purchase/components/CheckoutSessionProvider'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { centsToDollars } from 'helpers/numberHelper'

import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import PurchaseError from 'app/(candidate)/dashboard/purchase/components/PurchaseError'
import { OutreachPurchaseForm } from 'app/(candidate)/dashboard/components/tasks/flows/OutreachPurchaseForm'

interface PurchaseStepProps {
  onComplete?: () => void
  contactCount?: number
  type: string
  pricePerContact?: number
  phoneListId?: number | null
}

export const PurchaseStep = ({
  onComplete = () => {},
  contactCount = 0,
  type,
  pricePerContact = 0,
  phoneListId,
}: PurchaseStepProps) => {
  const { checkoutSession, error, fetchClientSecret } = useCheckoutSession()
  const hasTrackedPaymentStarted = useRef(false)
  const hasFetchedSession = useRef(false)

  // Fetch the checkout session when the component mounts
  useEffect(() => {
    if (phoneListId && !hasFetchedSession.current) {
      hasFetchedSession.current = true
      fetchClientSecret().catch(() => {
        // Error is handled by the provider
      })
    }
  }, [phoneListId, fetchClientSecret])

  useEffect(() => {
    if (
      checkoutSession &&
      contactCount > 0 &&
      !hasTrackedPaymentStarted.current
    ) {
      const totalCost = centsToDollars(pricePerContact * contactCount)

      trackEvent(EVENTS.Outreach.PaymentStarted, {
        channel: type === 'text' ? 'texting' : type,
        units: contactCount,
        cost: totalCost,
      })

      hasTrackedPaymentStarted.current = true
    }
  }, [checkoutSession, contactCount, type, pricePerContact])

  return (
    <div className="p-4 w-[80vw] max-w-xl">
      {error ? (
        <PurchaseError {...{}} />
      ) : !phoneListId || !checkoutSession ? (
        <LoadingAnimation {...{}} />
      ) : (
        <OutreachPurchaseForm
          {...{
            contactCount,
            onComplete,
          }}
        />
      )}
    </div>
  )
}
