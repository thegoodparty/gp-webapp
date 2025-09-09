'use client'
import { createContext, useContext, useState } from 'react'
import { PURCHASE_TYPES } from 'helpers/purchaseTypes'
import { createPurchaseIntent } from 'app/(candidate)/dashboard/purchase/utils/purchaseFetch.utils'
import { useSingleEffect } from '@shared/hooks/useSingleEffect'

export const PurchaseIntentContext = createContext({
  paymentIntent: null,
  setPaymentIntent: () => {},
  error: null,
  setError: () => {},
  metaData: {},
  setMetaData: () => {},
})

export const PurchaseIntentProvider = ({
  children,
  type = '',
  purchaseMetaData = {},
}) => {
  const [purchaseIntent, setPurchaseIntent] = useState(null)
  const [error, setError] = useState(null)
  const [metaData, setMetaData] = useState(purchaseMetaData)

  useSingleEffect(() => {
    const createNewPurchaseIntent = async () => {
      if (!type || !PURCHASE_TYPES[type]) {
        setError('Invalid purchase type')
        return
      }

      const response = await createPurchaseIntent(type, metaData)
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
      value={{
        purchaseIntent,
        setPurchaseIntent,
        error,
        setError,
        metaData,
        setMetaData,
      }}
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
