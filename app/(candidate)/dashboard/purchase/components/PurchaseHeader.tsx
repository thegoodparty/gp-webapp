import H2 from '@shared/typography/H2'
import Body1 from '@shared/typography/Body1'
import { useCheckoutSession } from 'app/(candidate)/dashboard/purchase/components/CheckoutSessionProvider'
import { ReactNode } from 'react'

interface PurchaseHeaderProps {
  label?: string
  description?: string
  children?: ReactNode
}

export const PurchaseHeader = ({
  label,
  description,
  children = null,
}: PurchaseHeaderProps): React.JSX.Element => {
  const { checkoutSession } = useCheckoutSession()
  const amount = checkoutSession?.amount || 0
  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-6 mb-8">
      {label && <H2>{label}</H2>}
      {description && (
        <Body1 className="text-gray-600 mt-2">{description}</Body1>
      )}
      {children}
      <Body1 className="font-semibold mt-2">Amount: ${amount.toFixed(2)}</Body1>
    </div>
  )
}
