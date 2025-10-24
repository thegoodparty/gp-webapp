import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { useSnackbar } from 'helpers/useSnackbar'

import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import PurchaseError from 'app/(candidate)/dashboard/purchase/components/PurchaseError'
import PurchasePayment from 'app/(candidate)/dashboard/purchase/components/PurchasePayment'

export const PurchaseStep = ({ onComplete = () => {} }) => {
  const { purchaseIntent, error, setError } = usePurchaseIntent()
  const { errorSnackbar } = useSnackbar()

  const handlePaymentError = (error) => {
    setError(error)
    errorSnackbar(error.message)
  }

  return (
    <div className="p-4 w-[80vw] max-w-xl text-center">
      {error ? (
        <PurchaseError />
      ) : !purchaseIntent ? (
        <LoadingAnimation />
      ) : (
        <PurchasePayment
          onPaymentSuccess={onComplete}
          onPaymentError={handlePaymentError}
        />
      )}
    </div>
  )
}
