'use client'

import { CheckoutProvider } from '@stripe/react-stripe-js/checkout'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'
import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } from 'appEnv'
import { useCheckoutSession } from './CheckoutSessionProvider'

const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export type CheckoutPaymentProps = {
  onPaymentSuccess: (sessionId: string) => void
  onPaymentError?: (errorMessage: string) => void
}

/**
 * Payment component that uses Stripe's Custom Checkout with promo code support.
 * This replaces PurchasePayment for flows that need to support promo codes.
 */
const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({
  onPaymentSuccess,
  onPaymentError,
}) => {
  const { fetchClientSecret, checkoutSession } = useCheckoutSession()

  // clientSecret can be a Promise<string> per Stripe types
  const clientSecretPromise = fetchClientSecret()

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret: clientSecretPromise }}
    >
      <CheckoutForm
        onSuccess={onPaymentSuccess}
        onError={onPaymentError}
        sessionId={checkoutSession?.id}
      />
    </CheckoutProvider>
  )
}

export default CheckoutPayment
