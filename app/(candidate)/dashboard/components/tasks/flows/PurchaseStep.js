import { useEffect, useRef } from 'react'
import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { useSnackbar } from 'helpers/useSnackbar'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { centsToDollars } from 'helpers/numberHelper'

import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import PurchaseError from 'app/(candidate)/dashboard/purchase/components/PurchaseError'
import { OutreachPurchaseForm } from 'app/(candidate)/dashboard/components/tasks/flows/OutreachPurchaseForm'

export const PurchaseStep = ({
  onComplete = () => {},
  contactCount = 0,
  type,
  pricePerContact = 0,
  phoneListId,
}) => {
  const { purchaseIntent, error, setError } = usePurchaseIntent()
  const { errorSnackbar } = useSnackbar()
  const hasTrackedPaymentStarted = useRef(false)

  useEffect(() => {
    if (
      purchaseIntent &&
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
  }, [purchaseIntent, contactCount, type, pricePerContact])

  const handlePaymentError = (error) => {
    setError(errorMessage)
    errorSnackbar(errorMessage)
  }

  return (
    <div className="p-4 w-[80vw] max-w-xl">
      {error ? (
        <PurchaseError {...{}} />
      ) : !phoneListId || !purchaseIntent ? (
        <LoadingAnimation {...{}} />
      ) : (
        <OutreachPurchaseForm
          {...{
            contactCount,
            onComplete,
            onError: handlePaymentError,
          }}
        />
      )}
    </div>
  )
}
