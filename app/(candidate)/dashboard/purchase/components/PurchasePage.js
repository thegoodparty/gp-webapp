'use client'

import { useEffect, useState } from 'react'
import { completePurchase } from '../utils/purchaseFetch.utils'
import PurchaseError from './PurchaseError'
import PurchaseSuccess from './PurchaseSuccess'
import PurchasePayment from './PurchasePayment'
import { PURCHASE_TYPES } from 'helpers/purchaseTypes'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import LoadingAnimation from '@shared/utils/LoadingAnimation'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

const PURCHASE_STATE = {
  PAYMENT: 'payment',
  SUCCESS: 'success',
  ERROR: 'error',
}

export default function PurchasePage({ type, domain, websiteId, returnUrl }) {
  const [purchaseIntent, setPurchaseIntent] = useState(null)
  const [purchaseState, setPurchaseState] = useState(PURCHASE_STATE.PAYMENT)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!purchaseIntent) {
      createPurchaseIntent()
    }
  }, [purchaseIntent])

  const createPurchaseIntent = async () => {
    if (!type || !PURCHASE_TYPES[type]) {
      setError('Invalid purchase type')
      return
    }

    const response = await clientFetch(
      apiRoutes.payments.createPurchaseIntent,
      {
        type,
        metadata: {
          domainName: domain,
          websiteId,
        },
      },
    )

    if (response.ok) {
      setPurchaseIntent(response.data)
    } else {
      setError(response.data?.data?.error || 'Failed to create purchase intent')
    }
  }

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

  if (!purchaseIntent) {
    return <LoadingAnimation title="Initializing purchase form..." />
  }

  if (error || !purchaseIntent || purchaseState === PURCHASE_STATE.ERROR) {
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
