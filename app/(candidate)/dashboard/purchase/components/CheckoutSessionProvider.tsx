'use client'
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useCallback,
  useRef,
} from 'react'
import { PURCHASE_TYPES } from 'helpers/purchaseTypes'
import {
  createCheckoutSession,
  CheckoutSessionResponse,
} from 'app/(candidate)/dashboard/purchase/utils/purchaseFetch.utils'
import { reportErrorToNewRelic } from '@shared/new-relic'

export interface CheckoutSessionContextValue {
  checkoutSession: CheckoutSessionResponse | null
  setCheckoutSession: Dispatch<SetStateAction<CheckoutSessionResponse | null>>
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
  isLoading: boolean
  fetchClientSecret: () => Promise<string>
}

export const CheckoutSessionContext = createContext<
  CheckoutSessionContextValue | undefined
>(undefined)

interface CheckoutSessionProviderProps {
  children: ReactNode
  type?: string
  purchaseMetaData?: Record<string, string | number | boolean | undefined>
  returnUrl?: string
}

/**
 * Provider for Custom Checkout Sessions with promo code support.
 * Uses Stripe's Custom Checkout integration with ui_mode: 'custom'.
 */
export const CheckoutSessionProvider = ({
  children,
  type = '',
  purchaseMetaData = {},
  returnUrl,
}: CheckoutSessionProviderProps) => {
  const [checkoutSession, setCheckoutSession] =
    useState<CheckoutSessionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const purchaseMetaDataRef = useRef(purchaseMetaData)
  purchaseMetaDataRef.current = purchaseMetaData

  const onError = (error: string) => {
    setError(error)
    reportErrorToNewRelic('CheckoutSessionProvider error', { message: error })
  }

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    if (checkoutSession?.clientSecret) {
      return checkoutSession.clientSecret
    }

    if (!type || !PURCHASE_TYPES[type as keyof typeof PURCHASE_TYPES]) {
      onError('Invalid purchase type')
      throw new Error('Invalid purchase type')
    }

    setIsLoading(true)
    try {
      const response = await createCheckoutSession(
        type,
        purchaseMetaDataRef.current,
        returnUrl,
      )
      if (response.ok) {
        setCheckoutSession(response.data)
        return response.data.clientSecret
      } else {
        const errorMessage =
          (response.data as { data?: { error?: string } })?.data?.error ||
          'Failed to create checkout session'
        onError(errorMessage)
        throw new Error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [checkoutSession, type, returnUrl])

  return (
    <CheckoutSessionContext.Provider
      value={{
        checkoutSession,
        setCheckoutSession,
        error,
        setError,
        isLoading,
        fetchClientSecret,
      }}
    >
      {children}
    </CheckoutSessionContext.Provider>
  )
}

export const useCheckoutSession = (): CheckoutSessionContextValue => {
  const context = useContext(CheckoutSessionContext)
  if (!context) {
    throw new Error(
      'useCheckoutSession must be used within a CheckoutSessionProvider',
    )
  }
  return context
}
