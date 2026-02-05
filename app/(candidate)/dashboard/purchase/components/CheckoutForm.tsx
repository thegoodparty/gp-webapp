'use client'

import { FormEvent, useState, useEffect, useRef } from 'react'
import {
  PaymentElement,
  useCheckout,
  StripeCheckoutValue,
} from '@stripe/react-stripe-js/checkout'
import Button from '@shared/buttons/Button'
import { useSnackbar } from '@shared/utils/Snackbar'
import { reportErrorToNewRelic } from '@shared/new-relic'
import { useMutation } from '@tanstack/react-query'
import { StripeError } from '@stripe/stripe-js'
import { useCheckoutSession } from './CheckoutSessionProvider'
import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import TextField from '@shared/inputs/TextField'

interface CheckoutFormProps {
  onSuccess: (sessionId: string) => void
  onError?: (error: string) => void
  sessionId?: string
}

/**
 * Checkout form that uses Stripe's Custom Checkout with promo code support.
 * Uses useCheckout hook instead of useStripe/useElements.
 */
export default function CheckoutForm({
  onSuccess,
  onError,
  sessionId,
}: CheckoutFormProps): React.JSX.Element {
  const { setError } = useCheckoutSession()
  const checkoutResult = useCheckout()
  const { errorSnackbar } = useSnackbar()
  const errorHandledRef = useRef(false)

  // Handle error state with useEffect to avoid side effects during render
  useEffect(() => {
    if (checkoutResult.type === 'error' && !errorHandledRef.current) {
      errorHandledRef.current = true
      const msg = checkoutResult.error.message || 'Unexpected payment error'
      reportErrorToNewRelic('checkout form initialization error', {
        stripeError: checkoutResult.error,
      })
      errorSnackbar(msg)
      setError(msg)
      if (onError) {
        onError(msg)
      }
    }
  }, [checkoutResult, errorSnackbar, setError, onError])

  // Handle loading state
  if (checkoutResult.type === 'loading') {
    return <LoadingAnimation />
  }

  // Handle error state display (side effects handled in useEffect above)
  if (checkoutResult.type === 'error') {
    return (
      <div className="text-red-600 text-center py-4">
        {checkoutResult.error.message}
      </div>
    )
  }

  const { checkout } = checkoutResult

  return (
    <CheckoutFormContent
      checkout={checkout}
      sessionId={sessionId}
      onSuccess={onSuccess}
      onError={(error) => {
        let msg: string
        if (error instanceof Error) {
          msg = error.message
          reportErrorToNewRelic(error, { location: 'checkout-form' })
        } else {
          msg = error.message || 'Unexpected payment error'
          reportErrorToNewRelic('checkout form stripe error', {
            stripeError: error,
          })
        }
        errorSnackbar(msg)
        setError(msg)
        if (onError) {
          onError(msg)
        }
      }}
    />
  )
}

// Separate component to avoid hooks conditionally
function CheckoutFormContent({
  checkout,
  sessionId,
  onSuccess,
  onError,
}: {
  checkout: StripeCheckoutValue
  sessionId?: string
  onSuccess: (sessionId: string) => void
  onError: (error: Error | StripeError) => void
}): React.JSX.Element {
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const { successSnackbar } = useSnackbar()
  const mutation = useMutation({
    mutationFn: async () => {
      const result = await checkout.confirm({ redirect: 'if_required' })

      if (result.type === 'error') {
        throw result.error
      }

      return sessionId!
    },
    onError,
    onSuccess,
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate()
  }

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

  // Get checkout session state to determine if ready
  const canSubmit = checkout.canConfirm

  // Check if a promo code is already applied
  const appliedDiscount = checkout.discountAmounts?.[0]
  const hasAppliedPromo = appliedDiscount && appliedDiscount.promotionCode

  // All amounts come from Stripe (single source of truth)
  // checkout.total is StripeCheckoutTotalSummary: { total, subtotal, discount, ... }
  // Each sub-field is StripeCheckoutAmount: { minorUnitsAmount: number, amount: string }
  const currentTotal = checkout.total.total.minorUnitsAmount / 100
  const originalTotal = checkout.total.subtotal.minorUnitsAmount / 100

  return (
    <form onSubmit={handleSubmit}>
      {/* Promo Code Section - only show if there's a payment to make */}
      {originalTotal > 0 && (
        <>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promo Code
            </label>
            {hasAppliedPromo ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">
                    {appliedDiscount.promotionCode}
                  </span>
                  <span className="text-sm text-gray-500">
                    (-${(appliedDiscount.minorUnitsAmount / 100).toFixed(2)})
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

            {/* Show updated total when promo is applied */}
            {hasAppliedPromo && (
              <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <span className="font-medium text-gray-700">Discounted Total</span>
                <div className="text-right">
                  <span className="text-sm text-gray-400 line-through mr-2">
                    ${originalTotal.toFixed(2)}
                  </span>
                  <span className="font-semibold text-lg text-green-600">
                    ${currentTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <PaymentElement
        onLoadError={({ error }) => {
          onError(error)
        }}
        options={{
          layout: 'tabs',
        }}
      />
      <Button
        type="submit"
        disabled={!canSubmit || mutation.isPending}
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
