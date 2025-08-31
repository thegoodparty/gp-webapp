import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { useSnackbar } from 'helpers/useSnackbar'

import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import PurchaseError from 'app/(candidate)/dashboard/purchase/components/PurchaseError'
import { OutreachPurchaseForm } from 'app/(candidate)/dashboard/components/tasks/flows/OutreachPurchaseForm'

export const PurchaseStep = ({
  onComplete = () => {},
  contactCount = 0,
  phoneListId,
}) => {
  const { purchaseIntent, error, setError } = usePurchaseIntent()
  const { errorSnackbar } = useSnackbar()

  const handlePaymentError = (error) => {
    setError(error)
    errorSnackbar(error.message)
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
