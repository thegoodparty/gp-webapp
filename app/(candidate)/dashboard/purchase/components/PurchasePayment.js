'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import H1 from '@shared/typography/H1'
import PurchaseForm from './PurchaseForm'
import Paper from '@shared/utils/Paper'
import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } from 'appEnv'
import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'

const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const PurchasePayment = ({ onPaymentSuccess, onPaymentError, children }) => {
  const { purchaseIntent } = usePurchaseIntent()

  return (
    purchaseIntent?.clientSecret && (
      <Paper className="max-w-2xl mx-auto mt-8">
        <H1>Complete Your Purchase</H1>
        {children}
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: purchaseIntent.clientSecret }}
        >
          <PurchaseForm onSuccess={onPaymentSuccess} onError={onPaymentError} />
        </Elements>
      </Paper>
    )
  )
}

export default PurchasePayment
