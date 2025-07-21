'use client'

import { useState } from 'react'
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Button from '@shared/buttons/Button'
import { useSnackbar } from '@shared/utils/Snackbar'
import { numberFormatter } from 'helpers/numberHelper'
import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } from 'appEnv'

const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function PaymentForm({
  clientSecret,
  domainName,
  price,
  onSuccess,
  onError,
}) {
  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-600">Unable to initialize payment</p>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#3b82f6',
          },
        },
      }}
    >
      <PaymentFormContent
        domainName={domainName}
        price={price}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}

function PaymentFormContent({ domainName, price, onSuccess, onError }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const { errorSnackbar, successSnackbar } = useSnackbar()
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      errorSnackbar('Stripe failed to load')
      return
    }

    setIsProcessing(true)
    setMessage('')

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (error) {
      setMessage(error.message || 'An unexpected error occurred.')
      errorSnackbar(error.message || 'Payment failed')
      onError(error)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      successSnackbar('Payment successful! Your domain is being registered.')
      onSuccess(paymentIntent)
    } else {
      setMessage('Payment processing...')
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Domain:</span>
          <span className="font-semibold">{domainName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Price:</span>
          <span className="font-semibold">${numberFormatter(price)}</span>
        </div>
      </div>

      <PaymentElement />

      {message && <div className="text-red-600 text-sm">{message}</div>}

      <Button
        type="submit"
        disabled={isProcessing || !stripe}
        loading={isProcessing}
        className="w-full"
      >
        {`Purchase ${domainName}`}
      </Button>
    </form>
  )
}
