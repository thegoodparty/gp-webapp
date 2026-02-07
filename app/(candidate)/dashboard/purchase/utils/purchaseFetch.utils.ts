import { apiRoutes } from 'gpApi/routes'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'

interface CompletePurchaseResponse {
  success: boolean
}

export interface CheckoutSessionResponse {
  id: string
  clientSecret: string
  amount: number
}

/**
 * Creates a Custom Checkout Session for one-time payments with promo code support.
 */
export function createCheckoutSession(
  type: string,
  metadata: Record<string, string | number | boolean | undefined>,
  returnUrl?: string,
  allowPromoCodes = true,
): Promise<ApiResponse<CheckoutSessionResponse>> {
  return clientFetch(apiRoutes.payments.createCustomCheckoutSession, {
    type,
    metadata,
    returnUrl,
    allowPromoCodes,
  })
}

/**
 * Completes a purchase made via Checkout Session.
 */
export function completeCheckoutSession(
  checkoutSessionId: string,
): Promise<ApiResponse<CompletePurchaseResponse>> {
  return clientFetch(apiRoutes.payments.completeCheckoutSession, {
    checkoutSessionId,
  })
}
