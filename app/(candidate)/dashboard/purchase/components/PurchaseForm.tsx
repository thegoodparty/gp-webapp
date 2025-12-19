'use client'

import { useState, FormEvent } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Button from '@shared/buttons/Button'
import { useSnackbar } from '@shared/utils/Snackbar'
import { reportErrorToNewRelic } from '@shared/new-relic'
import { useMutation } from '@tanstack/react-query'
import { PaymentIntent, StripeError } from '@stripe/stripe-js'

interface PurchaseFormProps {
  onSuccess: (paymentIntent: PaymentIntent) => void
  onError: (error: string) => void
}

export default function PurchaseForm({
  onSuccess,
  onError,
}: PurchaseFormProps): React.JSX.Element {
  const stripe = useStripe()
  const elements = useElements()
  const { errorSnackbar } = useSnackbar()

  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false)

  const onStripeError = (type: string, error: StripeError) => {
    reportErrorToNewRelic(type, { stripeError: error })
    const msg = error.message || 'Unexpected payment error'
    errorSnackbar(msg)
    onError(msg)
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
        onStripeError('payment confirmation error', error)
        throw new Error(error.message || 'Unexpected payment error')
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error(
          'Payment Intent status is not succeeded after confirmation',
        )
      }

      return paymentIntent
    },
    onError: (error) => {
      reportErrorToNewRelic(error)
      errorSnackbar(error.message)
      onError(error.message)
    },
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
          onStripeError('payment element load error', error)
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
