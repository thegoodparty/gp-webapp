'use client'
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react'
import { PURCHASE_TYPES } from 'helpers/purchaseTypes'
import { createPurchaseIntent } from 'app/(candidate)/dashboard/purchase/utils/purchaseFetch.utils'
import { useSingleEffect } from '@shared/hooks/useSingleEffect'

interface PurchaseIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

interface PurchaseIntentContextValue {
  purchaseIntent: PurchaseIntentResponse | null
  setPurchaseIntent: Dispatch<SetStateAction<PurchaseIntentResponse | null>>
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
  metaData: Record<string, string | number | boolean | undefined>
  setMetaData: Dispatch<
    SetStateAction<Record<string, string | number | boolean | undefined>>
  >
}

export const PurchaseIntentContext = createContext<
  PurchaseIntentContextValue | undefined
>(undefined)

interface PurchaseIntentProviderProps {
  children: ReactNode
  type?: string
  purchaseMetaData?: Record<string, string | number | boolean | undefined>
}

export const PurchaseIntentProvider = ({
  children,
  type = '',
  purchaseMetaData = {},
}: PurchaseIntentProviderProps) => {
  const [purchaseIntent, setPurchaseIntent] =
    useState<PurchaseIntentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [metaData, setMetaData] =
    useState<Record<string, string | number | boolean | undefined>>(
      purchaseMetaData,
    )

  useSingleEffect(() => {
    const createNewPurchaseIntent = async () => {
      if (!type || !PURCHASE_TYPES[type as keyof typeof PURCHASE_TYPES]) {
        setError('Invalid purchase type')
        return
      }

      const response = await createPurchaseIntent(type, metaData)
      if (response.ok) {
        setPurchaseIntent(response.data)
      } else {
        setError(
          (response.data as { data?: { error?: string } })?.data?.error ||
            'Failed to create purchase intent',
        )
      }
    }

    if (!purchaseIntent) {
      createNewPurchaseIntent()
    }
  }, [purchaseIntent, type, metaData])

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

export const usePurchaseIntent = (): PurchaseIntentContextValue => {
  const context = useContext(PurchaseIntentContext)
  if (!context) {
    throw new Error(
      'usePurchaseIntent must be used within a PurchaseIntentProvider',
    )
  }
  return context
}
