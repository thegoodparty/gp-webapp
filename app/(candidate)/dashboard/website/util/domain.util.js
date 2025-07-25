export const PAYMENT_STATUS = {
  REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
  REQUIRES_CONFIRMATION: 'requires_confirmation',
  REQUIRES_ACTION: 'requires_action',
  PROCESSING: 'processing',
  REQUIRES_CAPTURE: 'requires_capture',
  CANCELED: 'canceled',
  SUCCEEDED: 'succeeded',
}

export const DOMAIN_STATUS = {
  NO_DOMAIN: 'NO_DOMAIN',
  SUBMITTED: 'SUBMITTED',
  IN_PROGRESS: 'IN_PROGRESS',
  ERROR: 'ERROR',
  SUCCESSFUL: 'SUCCESSFUL',
  FAILED: 'FAILED',
  REGISTERED: 'REGISTERED',
}

export function isDomainActive(domain = {}) {
  const status = domain?.status ? domain.status.toUpperCase() : null

  if (!status) {
    return false
  }

  return (
    status === DOMAIN_STATUS.SUBMITTED ||
    status === DOMAIN_STATUS.IN_PROGRESS ||
    status === DOMAIN_STATUS.REGISTERED ||
    status === DOMAIN_STATUS.SUCCESSFUL
  )
}
