import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import Button from '@shared/buttons/Button'
import PurchasePayment from 'app/(candidate)/dashboard/purchase/components/PurchasePayment'
import H6 from '@shared/typography/H6'

export const PurchaseStep = ({ onComplete = () => {} }) => {
  const { purchaseIntent, metaData, error, setError } = usePurchaseIntent()
  console.log(`{ purchaseIntent, error, setError } =>`, {
    purchaseIntent,
    error,
    metaData,
  })
  const handlePaymentSuccess = () => {}
  const handlePaymentError = (error) => {
    setError(error.message)
  }

  return (
    <div className="p-4 w-[80vw] max-w-xl">
      Purchase Step - to be implemented
      <Button
        {...{
          onClick: onComplete,
        }}
      >
        Do It
      </Button>
      {purchaseIntent && (
        <PurchasePayment
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        >
          <H6>Texts: {}</H6>
          <H6>Amount: {purchaseIntent?.amount}</H6>
        </PurchasePayment>
      )}
    </div>
  )
}
