export const PURCHASE_TYPES = {
  DOMAIN_REGISTRATION: 'DOMAIN_REGISTRATION',
  TEXT: 'TEXT',
  POLL: 'POLL',
}

export const PURCHASE_TYPE_LABELS = {
  [PURCHASE_TYPES.DOMAIN_REGISTRATION]: 'Domain Registration',
  [PURCHASE_TYPES.POLL]: 'SMS Poll Payment',
}

export const PURCHASE_TYPE_DESCRIPTIONS = {
  [PURCHASE_TYPES.DOMAIN_REGISTRATION]:
    'Register a custom domain for your website',
  [PURCHASE_TYPES.POLL]: 'Expand your SMS poll',
}

export const PURCHASE_STATE = {
  PAYMENT: 'payment',
  SUCCESS: 'success',
  ERROR: 'error',
}
