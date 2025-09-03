import H1 from '@shared/typography/H1'
import {
  PurchaseHeader
} from 'app/(candidate)/dashboard/purchase/components/PurchaseHeader'
import Body1 from '@shared/typography/Body1'
import PurchasePayment
  from 'app/(candidate)/dashboard/purchase/components/PurchasePayment'
import Button from '@shared/buttons/Button'
import { useCampaign } from '@shared/hooks/useCampaign'
import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { FREE_TEXTS_OFFER } from '../../../outreach/constants'

export const OutreachPurchaseForm = ({
  onComplete = () => {},
  contactCount = 0,
  onError = () => {},
}) => {
  const [campaign] = useCampaign()
  const { purchaseIntent } = usePurchaseIntent()
  
  const hasFreeTextsOffer = campaign?.hasFreeTextsOffer
  const discount = hasFreeTextsOffer ? Math.min(contactCount, FREE_TEXTS_OFFER.COUNT) : 0
  const isFree = hasFreeTextsOffer && contactCount <= FREE_TEXTS_OFFER.COUNT
  const totalCost = purchaseIntent?.amount ? purchaseIntent.amount / 100 : 0

  const handleFreeComplete = () => {
    onComplete()
  }

  return (
    <div className="min-h-max">
      <H1>Review</H1>
      
      {/* Review Details */}
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
          variant="primary" 
          size="large"
          className="w-full"
          onClick={handleFreeComplete}
        >
          Schedule text
        </Button>
      ) : (
        <>
          <PurchaseHeader>
            <Body1>Texts: {contactCount}</Body1>
          </PurchaseHeader>
          <PurchasePayment
            {...{
              onPaymentSuccess: onComplete,
              onPaymentError: onError,
            }}
          />
        </>
      )}
    </div>
  )
}
