'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { PURCHASE_TYPES } from 'helpers/purchaseTypes'
import { createPurchaseIntent } from 'app/(candidate)/dashboard/purchase/utils/purchaseFetch.utils'

export const PurchaseIntentContext = createContext({
  paymentIntent: null,
  setPaymentIntent: () => {},
  error: null,
  setError: () => {},
})

export const PurchaseIntentProvider = ({
  children,
  type = '',
  purchaseMetaData = {},
}) => {
  const [purchaseIntent, setPurchaseIntent] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const createNewPurchaseIntent = async () => {
      if (!type || !PURCHASE_TYPES[type]) {
        setError('Invalid purchase type')
        return
      }

      const response = await createPurchaseIntent(type, purchaseMetaData)
      if (response.ok) {
        setPurchaseIntent(response.data)
      } else {
        setError(
          response.data?.data?.error || 'Failed to create purchase intent',
        )
      }
    }

    if (!purchaseIntent) {
      createNewPurchaseIntent()
    }
  }, [purchaseIntent, type, purchaseMetaData])

  return (
    <PurchaseIntentContext.Provider
      value={{ purchaseIntent, setPurchaseIntent, error, setError }}
    >
      {children}
    </PurchaseIntentContext.Provider>
  )
}

export const usePurchaseIntent = () => {
  const context = useContext(PurchaseIntentContext)
  if (!context) {
    throw new Error(
      'usePurchaseIntent must be used within a PurchaseIntentProvider',
    )
  }
  return context
}
