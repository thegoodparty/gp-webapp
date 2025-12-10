'use client'

import H1 from '@shared/typography/H1'
import { PurchaseIntentProvider } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { PURCHASE_TYPES } from 'helpers/purchaseTypes'

import { completePurchase } from 'app/(candidate)/dashboard/purchase/utils/purchaseFetch.utils'

import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { useSnackbar } from 'helpers/useSnackbar'

import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import PurchaseError from 'app/(candidate)/dashboard/purchase/components/PurchaseError'
import PurchasePayment from 'app/(candidate)/dashboard/purchase/components/PurchasePayment'
import { PaymentIntent } from '@stripe/stripe-js'

const PurchaseContent: React.FC<{
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void
}> = ({ onPaymentSuccess }) => {
  const { purchaseIntent, error, setError } = usePurchaseIntent()
  const { errorSnackbar } = useSnackbar()

  const handlePaymentError = (error: Error) => {
    setError(
      // @ts-expect-error setError is not correctly typed yet.
      error,
    )
    errorSnackbar(error.message)
  }

  return (
    <div className="p-4 mx-auto w-[80vw] max-w-xl text-center">
      {error ? (
        <PurchaseError error={null} serverError={null} />
      ) : !purchaseIntent ? (
        <LoadingAnimation />
      ) : (
        <PurchasePayment
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
    </div>
  )
}

export enum PollPurchaseType {
  new = 'new',
  expansion = 'expansion',
}

export type PollPaymentMetadata =
  | {
      pollPurchaseType: PollPurchaseType.new
      pollId: string
      name: string
      message: string
      imageUrl: string | undefined
      audienceSize: number
      scheduledDate: string
    }
  | {
      pollPurchaseType: PollPurchaseType.expansion
      pollId: string
      count: number
      scheduledDate: string
    }

export type PollPaymentProps = {
  purchaseMetaData: PollPaymentMetadata
  onConfirmed: (paymentIntent: PaymentIntent) => void
}

export const PollPayment: React.FC<PollPaymentProps> = ({
  purchaseMetaData,
  onConfirmed,
}) => {
  const handlePurchaseComplete = async (paymentIntent: PaymentIntent) => {
    await completePurchase(paymentIntent.id)
    onConfirmed(paymentIntent)
  }

  return (
    <>
      <H1 className="text-center">SMS Poll Payment</H1>
      <PurchaseIntentProvider
        type={PURCHASE_TYPES.POLL}
        purchaseMetaData={purchaseMetaData}
      >
        <PurchaseContent onPaymentSuccess={handlePurchaseComplete} />
      </PurchaseIntentProvider>
    </>
  )
}
