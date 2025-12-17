export const PURCHASE_TYPES = {
  DOMAIN_REGISTRATION: 'DOMAIN_REGISTRATION',
  TEXT: 'TEXT',
  POLL: 'POLL',
} as const

export type PurchaseType = typeof PURCHASE_TYPES[keyof typeof PURCHASE_TYPES]

export const PURCHASE_TYPE_LABELS: Record<PurchaseType, string> = {
  [PURCHASE_TYPES.DOMAIN_REGISTRATION]: 'Domain Registration',
  [PURCHASE_TYPES.POLL]: 'SMS Poll Payment',
  [PURCHASE_TYPES.TEXT]: '',
}

export const PURCHASE_TYPE_DESCRIPTIONS: Record<PurchaseType, string> = {
  [PURCHASE_TYPES.DOMAIN_REGISTRATION]: 'Register a custom domain for your website',
  [PURCHASE_TYPES.POLL]: 'Expand your SMS poll',
  [PURCHASE_TYPES.TEXT]: '',
}

export const PURCHASE_STATE = {
  PAYMENT: 'payment',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

export type PurchaseState = typeof PURCHASE_STATE[keyof typeof PURCHASE_STATE]

