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

export function completeCheckoutSession(
  checkoutSessionId: string,
): Promise<ApiResponse<CompletePurchaseResponse>> {
  return clientFetch(apiRoutes.payments.completeCheckoutSession, {
    checkoutSessionId,
  })
}
