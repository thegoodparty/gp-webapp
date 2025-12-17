'use client'

import { useState, FormEvent } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Button from '@shared/buttons/Button'
import { useSnackbar } from '@shared/utils/Snackbar'

interface PurchaseFormProps {
  onSuccess: () => void
  onError: (error: Error) => void
}

export default function PurchaseForm({ onSuccess, onError }: PurchaseFormProps): React.JSX.Element {
  const stripe = useStripe()
  const elements = useElements()
  const { errorSnackbar } = useSnackbar()

  const [isLoading, setIsLoading] = useState(false)
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (error) {
      errorSnackbar(error.message || 'Payment failed')
      onError(new Error(error.message || 'Payment failed'))
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess()
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        onReady={() => setIsPaymentElementReady(true)}
        options={{
          layout: 'tabs',
        }}
      />
      <Button
        type="submit"
        disabled={!stripe || !isPaymentElementReady || isLoading}
        loading={isLoading}
        className="mt-6 w-full"
        color="primary"
        size="large"
      >
        Complete Purchase
      </Button>
    </form>
  )
}
