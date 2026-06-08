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
} from 'app/dashboard/purchase/utils/purchaseFetch.utils'
import { reportErrorToSentry } from 'app/shared/sentry'

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
  receiptEmail?: string
  returnUrl?: string
  // When provided, the session is created by this function instead of the
  // typed one-time `createCheckoutSession(type, ...)` path. Used by the Pro
  // upgrade wizard to mount the subscription checkout while reusing the rest of
  // the provider (caching, in-flight dedupe, error state). It must throw on
  // failure; the provider surfaces the message via `error`.
  createSession?: () => Promise<CheckoutSessionResponse>
}

export const CheckoutSessionProvider = ({
  children,
  type = '',
  purchaseMetaData = {},
  receiptEmail,
  returnUrl,
  createSession,
}: CheckoutSessionProviderProps) => {
  const [checkoutSession, setCheckoutSession] =
    useState<CheckoutSessionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const purchaseMetaDataRef = useRef(purchaseMetaData)
  purchaseMetaDataRef.current = purchaseMetaData

  // Store in-flight promise to deduplicate concurrent calls.
  // This makes fetchClientSecret safe regardless of caller behavior —
  // if two calls race before the first resolves, both return the same promise.
  const pendingRequestRef = useRef<Promise<string> | null>(null)

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    if (checkoutSession?.clientSecret) {
      return checkoutSession.clientSecret
    }

    if (pendingRequestRef.current) {
      return pendingRequestRef.current
    }

    if (
      !createSession &&
      !PURCHASE_TYPES[type as keyof typeof PURCHASE_TYPES]
    ) {
      setError('Invalid purchase type')
      reportErrorToSentry(new Error('CheckoutSessionProvider error'), {
        message: 'Invalid purchase type',
      })
      throw new Error('Invalid purchase type')
    }

    setIsLoading(true)
    const request = (async () => {
      try {
        if (createSession) {
          try {
            const session = await createSession()
            setCheckoutSession(session)
            return session.clientSecret
          } catch (err) {
            const errorMessage =
              err instanceof Error
                ? err.message
                : 'Failed to create checkout session'
            setError(errorMessage)
            reportErrorToSentry(new Error('CheckoutSessionProvider error'), {
              message: errorMessage,
            })
            throw err
          }
        }

        const response = await createCheckoutSession(
          type,
          purchaseMetaDataRef.current,
          receiptEmail,
          returnUrl,
        )
        if (response.ok) {
          setCheckoutSession(response.data)
          return response.data.clientSecret
        } else {
          const errorMessage =
            (response.data as { data?: { error?: string } })?.data?.error ||
            'Failed to create checkout session'
          setError(errorMessage)
          reportErrorToSentry(new Error('CheckoutSessionProvider error'), {
            message: errorMessage,
          })
          throw new Error(errorMessage)
        }
      } finally {
        setIsLoading(false)
        pendingRequestRef.current = null
      }
    })()

    pendingRequestRef.current = request
    return request
  }, [checkoutSession, type, receiptEmail, returnUrl, createSession])

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
