import { useEffect, useState, useRef } from 'react'
import { PurchaseStatus } from '../utils/purchaseFetch.utils'

const { API_BASE_URL } = process.env

interface PurchaseStatusData {
  status: PurchaseStatus
  paymentStatus?: string
  sessionStatus?: string | null
  paymentStatus?: string
  purchaseType?: string
  result?: unknown
}

interface UsePurchaseStatusStreamOptions {
  onStatusChange?: (status: PurchaseStatus) => void
  onComplete?: (data: PurchaseStatusData) => void
  onError?: (error: Error) => void
}

/**
 * React hook for streaming purchase status updates via Server-Sent Events (SSE).
 * Automatically opens EventSource connection and handles reconnection.
 *
 * @param paymentIntentId - The Stripe PaymentIntent ID to monitor
 * @param options - Callbacks for status changes and completion
 * @returns Current purchase status data and connection state
 *
 * @example
 * const { status, data, isConnected } = usePurchaseStatusStream(paymentIntentId, {
 *   onComplete: (data) => setPurchaseState(PURCHASE_STATE.SUCCESS),
 *   onError: (error) => setError(error.message),
 * });
 */
export function usePurchaseStatusStream(
  paymentIntentId: string | null,
  options: UsePurchaseStatusStreamOptions = {},
) {
  const { onStatusChange, onComplete, onError } = options
  const [status, setStatus] = useState<PurchaseStatus>('processing')
  const [data, setData] = useState<PurchaseStatusData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!paymentIntentId) return

    const apiUrl = API_BASE_URL || ''
    const url = `${apiUrl}/payments/purchase/status/stream/payment-intent/${paymentIntentId}`

    console.log('Opening SSE connection:', url)

    const eventSource = new EventSource(url, {
      withCredentials: true, // Include cookies for authentication
    })

    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      console.log('SSE connection opened')
      setIsConnected(true)
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const statusData: PurchaseStatusData = JSON.parse(event.data)
        console.log('SSE status update:', statusData)

        setData(statusData)
        setStatus(statusData.status)

        if (onStatusChange) {
          onStatusChange(statusData.status)
        }

        // Handle terminal states
        if (statusData.status === 'completed') {
          if (onComplete) {
            onComplete(statusData)
          }
          eventSource.close()
          setIsConnected(false)
        } else if (statusData.status === 'failed') {
          const err = new Error('Purchase processing failed')
          setError(err)
          if (onError) {
            onError(err)
          }
          eventSource.close()
          setIsConnected(false)
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err)
        const parseError = new Error('Failed to parse status update')
        setError(parseError)
        if (onError) {
          onError(parseError)
        }
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err)
      const connectionError = new Error('Connection to server lost')
      setError(connectionError)
      setIsConnected(false)

      if (onError) {
        onError(connectionError)
      }

      // EventSource will automatically attempt to reconnect
      // unless we explicitly close it
    }

    // Cleanup on unmount
    return () => {
      console.log('Closing SSE connection')
      eventSource.close()
      eventSourceRef.current = null
      setIsConnected(false)
    }
  }, [paymentIntentId, onStatusChange, onComplete, onError])

  return {
    status,
    data,
    isConnected,
    error,
  }
}

/**
 * React hook for streaming checkout session status updates via Server-Sent Events (SSE).
 *
 * @param sessionId - The Stripe CheckoutSession ID to monitor
 * @param options - Callbacks for status changes and completion
 * @returns Current purchase status data and connection state
 */
export function useCheckoutSessionStatusStream(
  sessionId: string | null,
  options: UsePurchaseStatusStreamOptions = {},
) {
  const { onStatusChange, onComplete, onError } = options
  const [status, setStatus] = useState<PurchaseStatus>('processing')
  const [data, setData] = useState<PurchaseStatusData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!sessionId) return

    const apiUrl = API_BASE_URL || ''
    const url = `${apiUrl}/payments/purchase/status/stream/checkout-session/${sessionId}`

    console.log('Opening SSE connection:', url)

    const eventSource = new EventSource(url, {
      withCredentials: true,
    })

    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      console.log('SSE connection opened')
      setIsConnected(true)
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const statusData: PurchaseStatusData = JSON.parse(event.data)
        console.log('SSE status update:', statusData)

        setData(statusData)
        setStatus(statusData.status)

        if (onStatusChange) {
          onStatusChange(statusData.status)
        }

        // Handle terminal states
        if (statusData.status === 'completed') {
          if (onComplete) {
            onComplete(statusData)
          }
          eventSource.close()
          setIsConnected(false)
        } else if (statusData.status === 'failed') {
          const err = new Error('Purchase processing failed')
          setError(err)
          if (onError) {
            onError(err)
          }
          eventSource.close()
          setIsConnected(false)
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err)
        const parseError = new Error('Failed to parse status update')
        setError(parseError)
        if (onError) {
          onError(parseError)
        }
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err)
      const connectionError = new Error('Connection to server lost')
      setError(connectionError)
      setIsConnected(false)

      if (onError) {
        onError(connectionError)
      }
    }

    return () => {
      console.log('Closing SSE connection')
      eventSource.close()
      eventSourceRef.current = null
      setIsConnected(false)
    }
  }, [sessionId, onStatusChange, onComplete, onError])

  return {
    status,
    data,
    isConnected,
    error,
  }
}
