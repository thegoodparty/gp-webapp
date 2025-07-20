'use client'

import { useState } from 'react'
import { completePurchase } from '../utils/purchaseFetch.utils'
import PurchaseError from './PurchaseError'
import PurchaseSuccess from './PurchaseSuccess'
import PurchasePayment from './PurchasePayment'

export default function PurchasePage({
  type,
  domain,
  websiteId,
  returnUrl,
  purchaseIntent,
  error: serverError,
}) {
  const [purchaseState, setPurchaseState] = useState('payment')
  const [error, setError] = useState(null)

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const response = await completePurchase(paymentIntent.id)

      if (response.ok) {
        setPurchaseState('success')
      } else {
        setError(response.data?.data?.error || 'Failed to complete purchase')
        setPurchaseState('error')
      }
    } catch (error) {
      setError('Failed to complete purchase')
      setPurchaseState('error')
    }
  }

  const handlePaymentError = (error) => {
    setError(error.message)
    setPurchaseState('error')
  }

  if (serverError || !purchaseIntent) {
    return <PurchaseError serverError={serverError} />
  }

  if (purchaseState === 'error') {
    return <PurchaseError error={error} />
  }

  if (purchaseState === 'success') {
    return <PurchaseSuccess type={type} returnUrl={returnUrl} />
  }

  if (purchaseState === 'payment' && purchaseIntent.clientSecret) {
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
