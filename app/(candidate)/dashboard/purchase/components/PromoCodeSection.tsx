'use client'

import { useState } from 'react'
import { StripeCheckoutValue } from '@stripe/react-stripe-js/checkout'
import Button from '@shared/buttons/Button'
import { useSnackbar } from '@shared/utils/Snackbar'

export function usePromoCode(checkout: StripeCheckoutValue) {
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const { successSnackbar } = useSnackbar()

  const appliedDiscount = checkout.discountAmounts?.[0]
  const hasAppliedPromo = !!(appliedDiscount && appliedDiscount.promotionCode)

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

  return {
    promoCode,
    setPromoCode,
    promoError,
    isApplyingPromo,
    appliedDiscount,
    hasAppliedPromo,
    handleApplyPromoCode,
    handleRemovePromoCode,
  }
}

interface PromoCodeSectionProps {
  promoCode: string
  setPromoCode: (value: string) => void
  promoError: string | null
  isApplyingPromo: boolean
  appliedDiscount?: { promotionCode?: string | null; minorUnitsAmount: number } | null
  hasAppliedPromo: boolean
  handleApplyPromoCode: () => void
  handleRemovePromoCode: () => void
}

export default function PromoCodeSection({
  promoCode,
  setPromoCode,
  promoError,
  isApplyingPromo,
  appliedDiscount,
  hasAppliedPromo,
  handleApplyPromoCode,
  handleRemovePromoCode,
}: PromoCodeSectionProps) {
  return (
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
            {appliedDiscount && (
              <span className="text-sm text-gray-500">
                (-${(appliedDiscount.minorUnitsAmount / 100).toFixed(2)})
              </span>
            )}
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
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base font-[var(--outfit-font)] outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main"
          />
          <Button
            type="button"
            onClick={handleApplyPromoCode}
            disabled={!promoCode.trim() || isApplyingPromo}
            loading={isApplyingPromo}
            size="large"
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
  )
}
