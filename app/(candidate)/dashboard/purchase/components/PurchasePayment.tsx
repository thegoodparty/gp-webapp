'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, PaymentIntent } from '@stripe/stripe-js'
import PurchaseForm from './PurchaseForm'
import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } from 'appEnv'
import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'

const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export type PurchasePaymentProps = {
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void
  onPaymentError: (errorMessage: string) => void
}

const PurchasePayment: React.FC<PurchasePaymentProps> = ({
  onPaymentSuccess,
  onPaymentError,
}) => {
  const { purchaseIntent } = usePurchaseIntent()

  return (
    purchaseIntent?.clientSecret && (
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: purchaseIntent.clientSecret }}
      >
        <PurchaseForm onSuccess={onPaymentSuccess} onError={onPaymentError} />
      </Elements>
    )
  )
}

export default PurchasePayment
