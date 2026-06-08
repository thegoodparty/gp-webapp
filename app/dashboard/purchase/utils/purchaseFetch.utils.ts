import { apiRoutes } from 'gpApi/routes'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'
import { clientRequest } from 'gpApi/typed-request'

interface CompletePurchaseResponse {
  success: boolean
}

export interface CheckoutSessionResponse {
  // `id` and `amount` come back for the one-time Custom Checkout sessions but
  // not for the Pro subscription session (gp-api returns only `clientSecret`),
  // so both are optional. Consumers already default `amount` and treat `id` as
  // an optional Stripe session id.
  id?: string
  clientSecret: string
  amount?: number
}

export function createCheckoutSession(
  type: string,
  metadata: Record<string, string | number | boolean | undefined>,
  receiptEmail?: string,
  returnUrl?: string,
  allowPromoCodes = true,
): Promise<ApiResponse<CheckoutSessionResponse>> {
  return clientFetch(apiRoutes.payments.createCustomCheckoutSession, {
    type,
    metadata,
    ...(receiptEmail && { receiptEmail }),
    returnUrl,
    allowPromoCodes,
  })
}

// Pro $10/mo subscription. Mounts the same embedded Stripe Custom Checkout as
// the one-time flow, but the session is created by gp-api's
// `createProCheckoutSession` (embedded mode) which returns only a
// `clientSecret`. `returnUrl` is where Stripe sends the candidate when a
// confirm requires a redirect (e.g. 3DS). `isPro` is flipped by the Stripe
// webhook, not here.
export async function createProSubscriptionCheckoutSession(
  returnUrl?: string,
): Promise<CheckoutSessionResponse> {
  const { data } = await clientRequest(
    'POST /v1/payments/purchase/checkout-session',
    { embedded: true, returnUrl },
  )

  if (!data.clientSecret) {
    throw new Error('Missing client secret for Pro subscription checkout')
  }

  return { clientSecret: data.clientSecret }
}

export function completeCheckoutSession(
  checkoutSessionId: string,
): Promise<ApiResponse<CompletePurchaseResponse>> {
  return clientFetch(apiRoutes.payments.completeCheckoutSession, {
    checkoutSessionId,
  })
}

export function completeFreePurchase(
  purchaseType: string,
  metadata: Record<string, string | number | boolean | undefined>,
): Promise<ApiResponse<CompletePurchaseResponse>> {
  return clientFetch(apiRoutes.payments.completeFreePurchase, {
    purchaseType,
    metadata,
  })
}
