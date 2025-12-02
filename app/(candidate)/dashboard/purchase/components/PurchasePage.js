'use client'

import { useEffect, useState } from 'react'
import PurchasePayment from './PurchasePayment'
import {
  PURCHASE_STATE,
  PURCHASE_TYPE_DESCRIPTIONS,
  PURCHASE_TYPE_LABELS,
  PURCHASE_TYPES,
} from 'helpers/purchaseTypes'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import Body1 from '@shared/typography/Body1'
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import { PurchaseHeader } from 'app/(candidate)/dashboard/purchase/components/PurchaseHeader'
import { usePurchaseIntent } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { completePurchase } from 'app/(candidate)/dashboard/purchase/utils/purchaseFetch.utils'
import { PaymentInterstitials } from 'app/(candidate)/dashboard/purchase/components/PaymentInterstitials'
import H1 from '@shared/typography/H1'
import Paper from '@shared/utils/Paper'

export default function PurchasePage({ type, domain, returnUrl }) {
  const { setError, purchaseIntent } = usePurchaseIntent()
  const [purchaseState, setPurchaseState] = useState(PURCHASE_STATE.PAYMENT)

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const response = await completePurchase(paymentIntent.id)

      if (response.ok) {
        if (type === PURCHASE_TYPES.DOMAIN_REGISTRATION && domain) {
          const eventData = {
            domainSelected: domain,
            priceOfSelectedDomain: paymentIntent?.amount
              ? paymentIntent.amount / 100
              : null,
          }
          trackEvent(EVENTS.CandidateWebsite.PurchasedDomain, eventData)
        }

        setPurchaseState(PURCHASE_STATE.SUCCESS)
      } else {
        setError(response.data?.data?.error || 'Failed to complete purchase')
        setPurchaseState(PURCHASE_STATE.ERROR)
      }
    } catch (error) {
      setError('Failed to complete purchase')
      setPurchaseState(PURCHASE_STATE.ERROR)
    }
  }

  const handlePaymentError = (error) => {
    setError(error.message)
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
