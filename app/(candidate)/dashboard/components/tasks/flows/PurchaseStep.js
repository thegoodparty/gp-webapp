import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { useSnackbar } from 'helpers/useSnackbar'

import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import PurchaseError from 'app/(candidate)/dashboard/purchase/components/PurchaseError'
import { OutreachPurchaseForm } from 'app/(candidate)/dashboard/components/tasks/flows/OutreachPurchaseForm'

export const PurchaseStep = ({ onComplete = () => {}, voterCount = 0 }) => {
  const { purchaseIntent, metaData, error, setError } = usePurchaseIntent()
  const { errorSnackbar } = useSnackbar()

  const handlePaymentError = (error) => {
    setError(error)
    errorSnackbar(error.message)
  }

  return (
    <div className="p-4 w-[80vw] max-w-xl">
      {error ? (
        <PurchaseError {...{}} />
      ) : !purchaseIntent ? (
        <LoadingAnimation {...{}} />
      ) : (
        <OutreachPurchaseForm
          {...{
            voterCount,
            onComplete,
            onError: handlePaymentError,
          }}
        />
      )}
    </div>
  )
}
