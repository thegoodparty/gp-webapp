'use client'

import { ReactNode } from 'react'
import { CheckoutProvider } from '@stripe/react-stripe-js/checkout'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'
import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } from 'appEnv'
import { useCheckoutSession } from './CheckoutSessionProvider'

const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export type CheckoutPaymentProps = {
  onPaymentSuccess?: (sessionId: string) => void
  // Used when there is no Stripe session id client-side (the Pro subscription),
  // where fulfillment happens via the webhook and the form just confirms.
  onPaymentConfirmed?: () => void | Promise<void>
  onPaymentError?: (errorMessage: string) => void
  submitLabel?: string
  // Rendered inside the CheckoutProvider (alongside the form) so it can read the
  // live total via Stripe's useCheckout — e.g. the Pro plan order summary.
  orderSummary?: ReactNode
}

const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({
  onPaymentSuccess,
  onPaymentConfirmed,
  onPaymentError,
  submitLabel,
  orderSummary,
}) => {
  const { checkoutSession } = useCheckoutSession()

  if (!checkoutSession?.clientSecret) return null

  const form = (
    <CheckoutForm
      onSuccess={onPaymentSuccess}
      onConfirmed={onPaymentConfirmed}
      onError={onPaymentError}
      sessionId={checkoutSession.id}
      submitLabel={submitLabel}
    />
  )

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret: checkoutSession.clientSecret }}
    >
      {orderSummary ? (
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_360px] lg:items-start">
          {form}
          {orderSummary}
        </div>
      ) : (
        form
      )}
    </CheckoutProvider>
  )
}

export default CheckoutPayment
