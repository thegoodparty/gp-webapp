'use client'

import { useEffect, useState } from 'react'
import PurchasePayment from './PurchasePayment'
import {
  PURCHASE_STATE,
  PURCHASE_TYPE_DESCRIPTIONS,
  PURCHASE_TYPE_LABELS,
  PURCHASE_TYPES,
  PurchaseType,
  PurchaseState,
} from 'helpers/purchaseTypes'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import Body1 from '@shared/typography/Body1'
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import { PurchaseHeader } from 'app/(candidate)/dashboard/purchase/components/PurchaseHeader'
import { usePurchaseIntent, PurchaseIntentResponse } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { PurchaseStatus } from 'app/(candidate)/dashboard/purchase/utils/purchaseFetch.utils'
import { usePurchaseStatusStream } from 'app/(candidate)/dashboard/purchase/hooks/usePurchaseStatusStream'
import { PaymentInterstitials } from 'app/(candidate)/dashboard/purchase/components/PaymentInterstitials'
import H1 from '@shared/typography/H1'
import Paper from '@shared/utils/Paper'
import { PaymentIntent } from '@stripe/stripe-js'

interface PurchasePageProps {
  type: PurchaseType
  domain?: string
  returnUrl?: string
}

interface ErrorResponseData {
  data?: {
    error?: string
  }
}

function isErrorResponseData(data: { success: boolean } | ErrorResponseData): data is ErrorResponseData {
  return 'data' in data && data.data !== undefined && typeof data.data === 'object' && data.data !== null && 'error' in data.data
}

function getErrorMessage(data: { success: boolean } | ErrorResponseData): string | undefined {
  if (isErrorResponseData(data)) {
    return data.data?.error
  }
  return undefined
}

export default function PurchasePage({ type, domain, returnUrl }: PurchasePageProps): React.JSX.Element {
  const { setError, purchaseIntent } = usePurchaseIntent()
  const [purchaseState, setPurchaseState] = useState<PurchaseState>(PURCHASE_STATE.PAYMENT)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState<PurchaseStatus | null>(null)

  // Use SSE to stream purchase status updates in real-time
  const { status: streamStatus } = usePurchaseStatusStream(paymentIntentId, {
    onStatusChange: (status) => {
      setProcessingStatus(status)
    },
    onComplete: (data) => {
      if (type === PURCHASE_TYPES.DOMAIN_REGISTRATION && domain) {
        const eventData = {
          domainSelected: domain,
          priceOfSelectedDomain: purchaseIntent?.amount
            ? purchaseIntent.amount / 100
            : null,
        }
        trackEvent(EVENTS.CandidateWebsite.PurchasedDomain, eventData)
      }
      setPurchaseState(PURCHASE_STATE.SUCCESS)
    },
    onError: (error) => {
      setError(error.message || 'Failed to complete purchase. Please contact support.')
      setPurchaseState(PURCHASE_STATE.ERROR)
    },
  })

  const handlePaymentSuccess = async (paymentIntent: PaymentIntent | PurchaseIntentResponse) => {
    const intentId = 'id' in paymentIntent ? paymentIntent.id : paymentIntent.paymentIntentId

    // Set to processing state and start SSE stream
    setPurchaseState(PURCHASE_STATE.PROCESSING)
    setProcessingStatus('processing')
    setPaymentIntentId(intentId)
  }

  const handlePaymentError = () => {
    setPurchaseState(PURCHASE_STATE.ERROR)
  }

  useEffect(() => {
    if (
      purchaseIntent?.status === 'succeeded' &&
      purchaseState === PURCHASE_STATE.PAYMENT
    ) {
      handlePaymentSuccess(purchaseIntent)
    }
  }, [purchaseIntent])

  return (
    <DashboardLayout hideMenu showAlert={false}>
      <PaymentInterstitials {...{ type, purchaseState, returnUrl }} />
      {purchaseState === PURCHASE_STATE.PAYMENT &&
        purchaseIntent?.clientSecret && (
          <Paper className="max-w-2xl mx-auto mt-8">
            <H1>Complete Your Purchase</H1>
            <PurchaseHeader
              {...{
                label: PURCHASE_TYPE_LABELS[type],
                description: PURCHASE_TYPE_DESCRIPTIONS[type],
              }}
            >
              {type === PURCHASE_TYPES.DOMAIN_REGISTRATION && (
                <Body1 className="font-semibold mt-2">Domain: {domain}</Body1>
              )}
            </PurchaseHeader>
            <PurchasePayment
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </Paper>
        )}
    </DashboardLayout>
  )
}
