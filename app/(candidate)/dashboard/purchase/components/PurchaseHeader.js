import H2 from '@shared/typography/H2'
import Body1 from '@shared/typography/Body1'
import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'

export const PurchaseHeader = ({ label, description, children = null }) => {
  const { purchaseIntent } = usePurchaseIntent()
  const amount = purchaseIntent?.amount || 0
  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-6 mb-8">
      {label && <H2>{label}</H2>}
      {description && (
        <Body1 className="text-gray-600 mt-2">{description}</Body1>
      )}
      {children}
      <Body1 className="font-semibold mt-2">Amount: ${amount}</Body1>
    </div>
  )
}
