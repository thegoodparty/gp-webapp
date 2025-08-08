import H1 from '@shared/typography/H1'
import { PurchaseHeader } from 'app/(candidate)/dashboard/purchase/components/PurchaseHeader'
import Body1 from '@shared/typography/Body1'
import PurchasePayment from 'app/(candidate)/dashboard/purchase/components/PurchasePayment'

export const OutreachPurchaseForm = ({
  onComplete = () => {},
  voterCount = 0,
  onError = () => {},
}) => (
  <div className="min-h-max">
    <H1>Complete Your Purchase</H1>
    <PurchaseHeader>
      <Body1>Texts: {voterCount}</Body1>
    </PurchaseHeader>
    <PurchasePayment
      {...{
        onPaymentSuccess: onComplete,
        onPaymentError: onError,
      }}
    />
  </div>
)
