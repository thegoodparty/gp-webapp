'use client'

import { useState, FormEvent } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Button from '@shared/buttons/Button'
import { useSnackbar } from '@shared/utils/Snackbar'
import { reportErrorToNewRelic } from '@shared/new-relic'
import { useMutation } from '@tanstack/react-query'
import { PaymentIntent, StripeError } from '@stripe/stripe-js'
import { usePurchaseIntent } from './PurchaseIntentProvider'

interface PurchaseFormProps {
  onSuccess: (paymentIntent: PaymentIntent) => void
  onError?: (error: string) => void
}

export default function PurchaseForm({
  onSuccess,
  onError,
}: PurchaseFormProps): React.JSX.Element {
  const { setError } = usePurchaseIntent()
  const stripe = useStripe()
  const elements = useElements()
  const { errorSnackbar } = useSnackbar()

  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false)

  const _onError = (error: Error | StripeError) => {
    let msg: string
    if (error instanceof Error) {
      msg = error.message
      reportErrorToNewRelic(error, { location: 'purchase-form' })
    } else {
      msg = error.message || 'Unexpected payment error'
      reportErrorToNewRelic('purchase form stripe error', {
        stripeError: error,
      })
    }
    errorSnackbar(msg)
    setError(msg)
    if (onError) {
      onError(msg)
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      if (!stripe || !elements) {
        throw new Error('Stripe or elements not ready')
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        throw error
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error(
          'Payment Intent status is not succeeded after confirmation',
        )
      }

      return paymentIntent
    },
    onError: _onError,
    onSuccess,
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        onLoadError={({ error }) => {
          _onError(error)
        }}
        onReady={() => setIsPaymentElementReady(true)}
        options={{
          layout: 'tabs',
        }}
      />
      <Button
        type="submit"
        disabled={!stripe || !isPaymentElementReady || mutation.isPending}
        loading={mutation.isPending}
        className="mt-6 w-full"
        color="primary"
        size="large"
      >
        Complete Purchase
      </Button>
    </form>
  )
}
