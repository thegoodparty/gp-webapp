import gpFetch from '../gpApi/gpFetch'

export async function createPurchaseIntent(type, metadata) {
  return await gpFetch('/api/payments/purchase/create-intent', {
    method: 'POST',
    body: JSON.stringify({
      type,
      metadata,
    }),
  })
}

export async function completePurchase(paymentIntentId) {
  return await gpFetch('/api/payments/purchase/complete', {
    method: 'POST',
    body: JSON.stringify({
      paymentIntentId,
    }),
  })
}
