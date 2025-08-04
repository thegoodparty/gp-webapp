import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { PURCHASE_STATE } from 'helpers/purchaseTypes'
import LoadingAnimation from '@shared/utils/LoadingAnimation'
import PurchaseError from 'app/(candidate)/dashboard/purchase/components/PurchaseError'
import PurchaseSuccess from 'app/(candidate)/dashboard/purchase/components/PurchaseSuccess'

export const PaymentInterstitials = ({ type, purchaseState, returnUrl }) => {
  const { purchaseIntent, error } = usePurchaseIntent()
  const inErrorState = purchaseState === PURCHASE_STATE.ERROR || error
  return !purchaseIntent && !inErrorState ? (
    <LoadingAnimation title="Initializing purchase form..." />
  ) : inErrorState ? (
    <PurchaseError error={error} />
  ) : purchaseState === PURCHASE_STATE.SUCCESS ? (
    <PurchaseSuccess type={type} returnUrl={returnUrl} />
  ) : null
}
