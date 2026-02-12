import { apiRoutes } from 'gpApi/routes'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'

import { PurchaseIntentResponse } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'

interface CompletePurchaseResponse {
  success: boolean
}

export type PurchaseStatus = 'processing' | 'completed' | 'failed'

interface PurchaseStatusResponse {
  status: PurchaseStatus
  paymentStatus: string
  purchaseType?: string
  result?: unknown
}

export function createPurchaseIntent(
  type: string,
  metadata: Record<string, string | number | boolean | undefined>,
): Promise<ApiResponse<PurchaseIntentResponse>> {
  return clientFetch(apiRoutes.payments.createPurchaseIntent, {
    type,
    metadata,
  })
}

/**
 * @deprecated Use pollPaymentIntentStatus instead
 * This endpoint no longer executes domain logic - webhooks handle that.
 */
export function completePurchase(
  paymentIntentId: string,
): Promise<ApiResponse<CompletePurchaseResponse>> {
  return clientFetch(apiRoutes.payments.completePurchase, { paymentIntentId })
}

/**
 * Gets the current status of a purchase by PaymentIntent ID
 */
export function getPaymentIntentStatus(
  paymentIntentId: string,
): Promise<ApiResponse<PurchaseStatusResponse>> {
  return clientFetch(
    {
      ...apiRoutes.payments.getPaymentIntentStatus,
      path: apiRoutes.payments.getPaymentIntentStatus.path.replace(
        ':paymentIntentId',
        paymentIntentId,
      ),
    },
    {},
  )
}

/**
 * Gets the current status of a purchase by CheckoutSession ID
 */
export function getCheckoutSessionStatus(
  sessionId: string,
): Promise<ApiResponse<PurchaseStatusResponse>> {
  return clientFetch(
    {
      ...apiRoutes.payments.getCheckoutSessionStatus,
      path: apiRoutes.payments.getCheckoutSessionStatus.path.replace(
        ':sessionId',
        sessionId,
      ),
    },
    {},
  )
}

/**
 * Polls payment intent status until it reaches a terminal state (completed or failed)
 * @param paymentIntentId - The Stripe PaymentIntent ID
 * @param options - Polling configuration
 * @returns Promise that resolves with the final status response
 */
export async function pollPaymentIntentStatus(
  paymentIntentId: string,
  options: {
    maxAttempts?: number
    intervalMs?: number
    onStatusUpdate?: (status: PurchaseStatus) => void
  } = {},
): Promise<ApiResponse<PurchaseStatusResponse>> {
  const { maxAttempts = 60, intervalMs = 2000, onStatusUpdate } = options

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await getPaymentIntentStatus(paymentIntentId)

    if (!response.ok) {
      throw new Error('Failed to get payment intent status')
    }

    const { status } = response.data

    if (onStatusUpdate) {
      onStatusUpdate(status)
    }

    // Terminal states - return immediately
    if (status === 'completed' || status === 'failed') {
      return response
    }

    // Still processing - wait before next poll
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  throw new Error('Purchase processing timeout - max polling attempts reached')
}

/**
 * Polls checkout session status until it reaches a terminal state (completed or failed)
 * @param sessionId - The Stripe CheckoutSession ID
 * @param options - Polling configuration
 * @returns Promise that resolves with the final status response
 */
export async function pollCheckoutSessionStatus(
  sessionId: string,
  options: {
    maxAttempts?: number
    intervalMs?: number
    onStatusUpdate?: (status: PurchaseStatus) => void
  } = {},
): Promise<ApiResponse<PurchaseStatusResponse>> {
  const { maxAttempts = 60, intervalMs = 2000, onStatusUpdate } = options

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await getCheckoutSessionStatus(sessionId)

    if (!response.ok) {
      throw new Error('Failed to get checkout session status')
    }

    const { status } = response.data

    if (onStatusUpdate) {
      onStatusUpdate(status)
    }

    // Terminal states - return immediately
    if (status === 'completed' || status === 'failed') {
      return response
    }

    // Still processing - wait before next poll
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  throw new Error('Purchase processing timeout - max polling attempts reached')
}
