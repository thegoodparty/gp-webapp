'use client'

import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Button from '@shared/buttons/Button'
import { useSnackbar } from '@shared/utils/Snackbar'

export default function PurchaseForm({ onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const { errorSnackbar } = useSnackbar()

  const [isLoading, setIsLoading] = useState(false)
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    setIsLoading(false)

    if (error) {
      errorSnackbar(error.message)
      onError(error)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
          onReady={() => setIsPaymentElementReady(true)}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || !isPaymentElementReady || isLoading}
        loading={isLoading}
        className="w-full"
        size="large"
      >
        {isLoading ? 'Processing...' : 'Complete Purchase'}
      </Button>
    </form>
  )
}
