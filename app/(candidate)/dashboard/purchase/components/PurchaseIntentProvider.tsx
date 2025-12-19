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
import { reportErrorToNewRelic } from '@shared/new-relic'

interface PurchaseIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

interface PurchaseIntentContextValue {
  purchaseIntent: PurchaseIntentResponse | null
  setPurchaseIntent: Dispatch<SetStateAction<PurchaseIntentResponse | null>>
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
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

  const onError = (error: string) => {
    setError(error)
    reportErrorToNewRelic('PurchaseIntentProvider error', { message: error })
  }

  useSingleEffect(() => {
    const createNewPurchaseIntent = async () => {
      if (!type || !PURCHASE_TYPES[type as keyof typeof PURCHASE_TYPES]) {
        onError('Invalid purchase type')
        return
      }

      const response = await createPurchaseIntent(type, purchaseMetaData)
      if (response.ok) {
        setPurchaseIntent(response.data)
      } else {
        onError(
          (response.data as { data?: { error?: string } })?.data?.error ||
            'Failed to create purchase intent',
        )
      }
    }

    if (!purchaseIntent) {
      createNewPurchaseIntent()
    }
  }, [purchaseIntent, type])

  return (
    <PurchaseIntentContext.Provider
      value={{
        purchaseIntent,
        setPurchaseIntent,
        error,
        setError,
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
