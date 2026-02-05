import H1 from '@shared/typography/H1'
import CheckoutPayment from 'app/(candidate)/dashboard/purchase/components/CheckoutPayment'
import Button from '@shared/buttons/Button'
import { useCampaign } from '@shared/hooks/useCampaign'
import { FREE_TEXTS_OFFER } from '../../../outreach/constants'
import { useP2pUxEnabled } from 'app/(candidate)/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider'
import { useCheckoutSession } from 'app/(candidate)/dashboard/purchase/components/CheckoutSessionProvider'

interface OutreachPurchaseFormProps {
  onComplete?: () => void
  contactCount?: number
  onError?: () => void
}

export const OutreachPurchaseForm = ({
  onComplete = () => {},
  contactCount = 0,
  onError = () => {},
}: OutreachPurchaseFormProps) => {
  const [campaign] = useCampaign()
  const { p2pUxEnabled } = useP2pUxEnabled()
  const { checkoutSession } = useCheckoutSession()

  const hasFreeTextsOffer = p2pUxEnabled && campaign?.hasFreeTextsOffer
  const discount = hasFreeTextsOffer
    ? Math.min(contactCount, FREE_TEXTS_OFFER.COUNT)
    : 0
  const isFree = hasFreeTextsOffer && contactCount <= FREE_TEXTS_OFFER.COUNT
  const totalCost = isFree ? 0 : checkoutSession?.amount ?? 0

  const handleFreeComplete = () => {
    onComplete()
  }

  return (
    <div className="min-h-max">
      <H1>Review</H1>

      <div className="bg-gray-50 border rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Number of texts</span>
          <span className="font-medium">{contactCount.toLocaleString()}</span>
        </div>

        {hasFreeTextsOffer && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Discount</span>
            <span className="font-medium text-green-600">
              Up to {discount.toLocaleString()} Free
            </span>
          </div>
        )}

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="font-semibold text-lg">
              ${totalCost.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {isFree ? (
        <Button
          size="large"
          className="w-full"
          onClick={handleFreeComplete}
        >
          Schedule text
        </Button>
      ) : (
        <CheckoutPayment
          onPaymentSuccess={onComplete}
          onPaymentError={onError}
        />
      )}
    </div>
  )
}
