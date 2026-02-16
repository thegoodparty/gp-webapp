'use client'

import { useEffect, useRef } from 'react'
import H1 from '@shared/typography/H1'
import { CheckoutSessionProvider } from 'app/(candidate)/dashboard/purchase/components/CheckoutSessionProvider'
import { PURCHASE_TYPES } from 'helpers/purchaseTypes'

import { completeCheckoutSession } from 'app/(candidate)/dashboard/purchase/utils/purchaseFetch.utils'

import { useCheckoutSession } from 'app/(candidate)/dashboard/purchase/components/CheckoutSessionProvider'

import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import PurchaseError from 'app/(candidate)/dashboard/purchase/components/PurchaseError'
import CheckoutPayment from 'app/(candidate)/dashboard/purchase/components/CheckoutPayment'

const PurchaseContent: React.FC<{
  onPaymentSuccess: (sessionId: string) => void
}> = ({ onPaymentSuccess }) => {
  const { checkoutSession, error, fetchClientSecret } = useCheckoutSession()
  const hasFetchedSession = useRef(false)

  useEffect(() => {
    if (!hasFetchedSession.current) {
      hasFetchedSession.current = true
      fetchClientSecret().catch(() => {
        // Error is handled by the provider
      })
    }
  }, [fetchClientSecret])

  return (
    <div className="p-4 mx-auto w-[80vw] max-w-xl text-center">
      {error ? (
        <PurchaseError error={error} serverError={undefined} />
      ) : !checkoutSession ? (
        <LoadingAnimation />
      ) : (
        <CheckoutPayment onPaymentSuccess={onPaymentSuccess} />
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
  onConfirmed: (sessionId: string) => void
}

export const PollPayment: React.FC<PollPaymentProps> = ({
  purchaseMetaData,
  onConfirmed,
}) => {
  const handlePurchaseComplete = async (sessionId: string) => {
    await completeCheckoutSession(sessionId)
    onConfirmed(sessionId)
  }

  return (
    <>
      <H1 className="text-center">SMS Poll Payment</H1>
      <CheckoutSessionProvider
        type={PURCHASE_TYPES.POLL}
        purchaseMetaData={purchaseMetaData}
      >
        <PurchaseContent onPaymentSuccess={handlePurchaseComplete} />
      </CheckoutSessionProvider>
    </>
  )
}
