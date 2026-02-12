'use client'

import H1 from '@shared/typography/H1'
import { PurchaseIntentProvider } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { PURCHASE_TYPES } from 'helpers/purchaseTypes'

import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { usePurchaseStatusStream } from 'app/(candidate)/dashboard/purchase/hooks/usePurchaseStatusStream'

import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import PurchaseError from 'app/(candidate)/dashboard/purchase/components/PurchaseError'
import PurchasePayment from 'app/(candidate)/dashboard/purchase/components/PurchasePayment'
import { PaymentIntent } from '@stripe/stripe-js'
import { useState } from 'react'

const PurchaseContent: React.FC<{
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void
  onComplete: () => void
  onError: (error: Error) => void
}> = ({ onPaymentSuccess, onComplete, onError }) => {
  const { purchaseIntent, error } = usePurchaseIntent()
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  // Use SSE to stream purchase status updates in real-time
  usePurchaseStatusStream(paymentIntentId, {
    onComplete,
    onError,
  })

  const handlePaymentSuccess = (paymentIntent: PaymentIntent) => {
    setPaymentIntentId(paymentIntent.id)
    onPaymentSuccess(paymentIntent)
  }

  return (
    <div className="p-4 mx-auto w-[80vw] max-w-xl text-center">
      {error ? (
        <PurchaseError error={error} serverError={undefined} />
      ) : !purchaseIntent ? (
        <LoadingAnimation />
      ) : (
        <PurchasePayment onPaymentSuccess={handlePaymentSuccess} />
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
  const [savedPaymentIntent, setSavedPaymentIntent] = useState<PaymentIntent | null>(null)

  const handlePaymentSuccess = (paymentIntent: PaymentIntent) => {
    setSavedPaymentIntent(paymentIntent)
  }

  const handleComplete = () => {
    if (savedPaymentIntent) {
      onConfirmed(savedPaymentIntent)
    }
  }

  const handleError = (error: Error) => {
    console.error('Failed to complete poll purchase:', error)
  }

  return (
    <>
      <H1 className="text-center">SMS Poll Payment</H1>
      <PurchaseIntentProvider
        type={PURCHASE_TYPES.POLL}
        purchaseMetaData={purchaseMetaData}
      >
        <PurchaseContent
          onPaymentSuccess={handlePaymentSuccess}
          onComplete={handleComplete}
          onError={handleError}
        />
      </PurchaseIntentProvider>
    </>
  )
}
