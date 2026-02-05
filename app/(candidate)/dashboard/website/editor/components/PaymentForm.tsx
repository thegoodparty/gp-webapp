'use client'

import { useState, FormEvent } from 'react'
import {
  CheckoutProvider,
  useCheckout,
  PaymentElement,
} from '@stripe/react-stripe-js/checkout'
import { loadStripe, StripeError } from '@stripe/stripe-js'
import Button from '@shared/buttons/Button'
import { useSnackbar } from '@shared/utils/Snackbar'
import { numberFormatter } from 'helpers/numberHelper'
import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } from 'appEnv'
import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import TextField from '@shared/inputs/TextField'

const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

interface PaymentFormProps {
  clientSecret: string
  domainName: string
  price: number
  onSuccess: (sessionId: string) => void
  onError: (error: StripeError) => void
}

export default function PaymentForm({
  clientSecret,
  domainName,
  price,
  onSuccess,
  onError,
}: PaymentFormProps) {
  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-600">Unable to initialize payment</p>
      </div>
    )
  }

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <PaymentFormContent
        domainName={domainName}
        price={price}
        onSuccess={onSuccess}
        onError={onError}
      />
    </CheckoutProvider>
  )
}

interface PaymentFormContentProps {
  domainName: string
  price: number
  onSuccess: (sessionId: string) => void
  onError: (error: StripeError) => void
}

function PaymentFormContent({ domainName, price, onSuccess, onError }: PaymentFormContentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const { errorSnackbar, successSnackbar } = useSnackbar()
  const checkoutResult = useCheckout()

  // Handle loading and error states
  if (checkoutResult.type === 'loading') {
    return <LoadingAnimation />
  }

  if (checkoutResult.type === 'error') {
    return (
      <div className="text-red-600 text-center py-4">
        {checkoutResult.error.message}
      </div>
    )
  }

  const { checkout } = checkoutResult

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return

    setIsApplyingPromo(true)
    setPromoError(null)

    try {
      const result = await checkout.applyPromotionCode(promoCode.trim())
      if (result.type === 'error') {
        setPromoError(result.error.message)
      } else {
        successSnackbar('Promo code applied!')
        setPromoCode('')
      }
    } catch (err) {
      setPromoError('Failed to apply promo code')
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const handleRemovePromoCode = async () => {
    setIsApplyingPromo(true)
    try {
      await checkout.removePromotionCode()
      successSnackbar('Promo code removed')
    } catch (err) {
      // Ignore removal errors
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsProcessing(true)
    setMessage('')

    const result = await checkout.confirm({ redirect: 'if_required' })

    if (result.type === 'error') {
      const error = result.error
      setMessage(error.message || 'An unexpected error occurred.')
      errorSnackbar(error.message || 'Payment failed')
      onError(error as unknown as StripeError)
    } else if (result.type === 'success') {
      successSnackbar('Payment successful! Your domain is being registered.')
      // Get the session ID from the checkout
      onSuccess(checkout.id || '')
    } else {
      setMessage('Payment processing...')
    }

    setIsProcessing(false)
  }

  // Check if ready to confirm
  const canSubmit = checkout.canConfirm

  // Check if a promo code is already applied
  const appliedDiscount = checkout.discountAmounts?.[0]
  const hasAppliedPromo = appliedDiscount && appliedDiscount.promotionCode

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
        {hasAppliedPromo && appliedDiscount && (
          <div className="flex justify-between items-center mt-2 text-green-600">
            <span className="font-medium">Discount:</span>
            <span className="font-semibold">
              -${(appliedDiscount.minorUnitsAmount / 100).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Promo Code Section */}
      <div className="p-4 bg-gray-50 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Promo Code
        </label>
        {hasAppliedPromo ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">
                {appliedDiscount?.promotionCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemovePromoCode}
              disabled={isApplyingPromo}
              className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <TextField
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleApplyPromoCode}
              disabled={!promoCode.trim() || isApplyingPromo}
              loading={isApplyingPromo}
              size="medium"
              color="secondary"
            >
              Apply
            </Button>
          </div>
        )}
        {promoError && (
          <p className="mt-2 text-sm text-red-600">{promoError}</p>
        )}
      </div>

      <PaymentElement />

      {message && <div className="text-red-600 text-sm">{message}</div>}

      <Button
        type="submit"
        disabled={isProcessing || !canSubmit}
        loading={isProcessing}
        className="w-full"
      >
        {`Purchase ${domainName}`}
      </Button>
    </form>
  )
}
