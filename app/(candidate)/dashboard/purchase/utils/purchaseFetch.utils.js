import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

export function createPurchaseIntent(type, metadata) {
  return clientFetch(apiRoutes.payments.createPurchaseIntent, {
    type,
    metadata,
  })
}

export function completePurchase(paymentIntentId) {
  return clientFetch(apiRoutes.payments.completePurchase, { paymentIntentId })
}
