'use client'

import { useEffect, useRef, useState } from 'react'
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
import {
  useCheckoutSession,
  CheckoutSessionContextValue,
} from 'app/(candidate)/dashboard/purchase/components/CheckoutSessionProvider'
import { completeCheckoutSession } from 'app/(candidate)/dashboard/purchase/utils/purchaseFetch.utils'
import { PaymentInterstitials } from 'app/(candidate)/dashboard/purchase/components/PaymentInterstitials'
import H1 from '@shared/typography/H1'
import Paper from '@shared/utils/Paper'
import CheckoutPayment from 'app/(candidate)/dashboard/purchase/components/CheckoutPayment'
import { LoadingAnimation } from '@shared/utils/LoadingAnimation'
import PurchaseError from 'app/(candidate)/dashboard/purchase/components/PurchaseError'

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
  const { checkoutSession, error, setError, fetchClientSecret } = useCheckoutSession()
  const [purchaseState, setPurchaseState] = useState<PurchaseState>(PURCHASE_STATE.PAYMENT)
  const hasFetchedSession = useRef(false)

  useEffect(() => {
    if (!hasFetchedSession.current) {
      hasFetchedSession.current = true
      fetchClientSecret().catch(() => {
        // Error is handled by the provider
      })
    }
  }, [fetchClientSecret])

  const handlePaymentSuccess = async (sessionId: string) => {
    try {
      const response = await completeCheckoutSession(sessionId)

      if (response.ok) {
        if (type === PURCHASE_TYPES.DOMAIN_REGISTRATION && domain) {
          const eventData = {
            domainSelected: domain,
            priceOfSelectedDomain: checkoutSession?.amount ?? null,
          }
          trackEvent(EVENTS.CandidateWebsite.PurchasedDomain, eventData)
        }

        setPurchaseState(PURCHASE_STATE.SUCCESS)
      } else {
        setError(getErrorMessage(response.data) || 'Failed to complete purchase')
        setPurchaseState(PURCHASE_STATE.ERROR)
      }
    } catch (err) {
      setError('Failed to complete purchase')
      setPurchaseState(PURCHASE_STATE.ERROR)
    }
  }

  const handlePaymentError = () => {
    setPurchaseState(PURCHASE_STATE.ERROR)
  }

  return (
    <DashboardLayout hideMenu showAlert={false}>
      <PaymentInterstitials {...{ type, purchaseState, returnUrl }} />
      {purchaseState === PURCHASE_STATE.PAYMENT && (
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
          {error ? (
            <PurchaseError error={error} serverError={undefined} />
          ) : !checkoutSession ? (
            <LoadingAnimation />
          ) : (
            <CheckoutPayment
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}
        </Paper>
      )}
    </DashboardLayout>
  )
}
