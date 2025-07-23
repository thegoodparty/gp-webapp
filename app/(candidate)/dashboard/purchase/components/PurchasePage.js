'use client'

import { useState } from 'react'
import { completePurchase } from '../utils/purchaseFetch.utils'
import PurchaseError from './PurchaseError'
import PurchaseSuccess from './PurchaseSuccess'
import PurchasePayment from './PurchasePayment'
import { PURCHASE_TYPES } from 'helpers/purchaseTypes'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

const PURCHASE_STATE = {
  PAYMENT: 'payment',
  SUCCESS: 'success',
  ERROR: 'error',
}

export default function PurchasePage({
  type,
  domain,
  websiteId,
  returnUrl,
  purchaseIntent,
  error: serverError,
}) {
  const [purchaseState, setPurchaseState] = useState(PURCHASE_STATE.PAYMENT)
  const [error, setError] = useState(null)

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const response = await completePurchase(paymentIntent.id)

      if (response.ok) {
        if (type === PURCHASE_TYPES.DOMAIN_REGISTRATION && domain) {
          const eventData = {
            domainSelected: domain,
            priceOfSelectedDomain: purchaseIntent?.amount ? purchaseIntent.amount / 100 : null
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

  if (serverError || !purchaseIntent) {
    return <PurchaseError serverError={serverError} />
  }

  if (purchaseState === PURCHASE_STATE.ERROR) {
    return <PurchaseError error={error} />
  }

  if (purchaseState === PURCHASE_STATE.SUCCESS) {
    return <PurchaseSuccess type={type} returnUrl={returnUrl} />
  }

  if (purchaseState === PURCHASE_STATE.PAYMENT && purchaseIntent.clientSecret) {
    return (
      <PurchasePayment
        type={type}
        domain={domain}
        websiteId={websiteId}
        purchaseIntent={purchaseIntent}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    )
  }

  return null
}
