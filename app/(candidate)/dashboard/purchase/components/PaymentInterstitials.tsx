import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import {
  PURCHASE_STATE,
  PurchaseType,
  PurchaseState,
} from 'helpers/purchaseTypes'
import LoadingAnimationModal from '@shared/utils/LoadingAnimationModal'
import PurchaseError from 'app/(candidate)/dashboard/purchase/components/PurchaseError'
import PurchaseSuccess from 'app/(candidate)/dashboard/purchase/components/PurchaseSuccess'

interface PaymentInterstitialsProps {
  type: PurchaseType
  purchaseState: PurchaseState
  returnUrl?: string
}

export const PaymentInterstitials = ({
  type,
  purchaseState,
  returnUrl,
}: PaymentInterstitialsProps): React.JSX.Element | null => {
  const { purchaseIntent, error } = usePurchaseIntent()
  const inErrorState = purchaseState === PURCHASE_STATE.ERROR || error
  return !purchaseIntent && !inErrorState ? (
    <LoadingAnimationModal title="Initializing purchase form..." />
  ) : inErrorState ? (
    <PurchaseError error={error || undefined} />
  ) : purchaseState === PURCHASE_STATE.SUCCESS ? (
    <PurchaseSuccess type={type} returnUrl={returnUrl} />
  ) : null
}
