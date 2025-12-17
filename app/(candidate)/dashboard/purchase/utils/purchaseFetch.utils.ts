import { apiRoutes } from 'gpApi/routes'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'

interface PurchaseIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

interface CompletePurchaseResponse {
  success: boolean
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

export function completePurchase(
  paymentIntentId: string,
): Promise<ApiResponse<CompletePurchaseResponse>> {
  return clientFetch(apiRoutes.payments.completePurchase, { paymentIntentId })
}
