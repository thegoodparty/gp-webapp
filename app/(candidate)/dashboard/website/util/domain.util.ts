import { PURCHASE_TYPES } from 'helpers/purchaseTypes'

export const PAYMENT_STATUS = {
  REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
  REQUIRES_CONFIRMATION: 'requires_confirmation',
  REQUIRES_ACTION: 'requires_action',
  PROCESSING: 'processing',
  REQUIRES_CAPTURE: 'requires_capture',
  CANCELED: 'canceled',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
}

export const DOMAIN_STATUS = {
  NO_DOMAIN: 'NO_DOMAIN',
  SUBMITTED: 'SUBMITTED',
  IN_PROGRESS: 'IN_PROGRESS',
  INACTIVE: 'INACTIVE',
  ERROR: 'ERROR',
  SUCCESSFUL: 'SUCCESSFUL',
}

interface Domain {
  status?: string
}

interface Router {
  push: (url: string) => void
}

interface PurchaseDomainFlowParams {
  websiteId: string | number
  domainName: string
  router: Router
}

export function isDomainActive(domain: Domain = {}): boolean {
  const status = domain?.status ? domain.status.toUpperCase() : null
  return isDomainStatusActive(status)
}

export function isDomainStatusActive(status: string | null): boolean {
  if (!status) {
    return false
  }

  return (
    status === DOMAIN_STATUS.SUBMITTED || status === DOMAIN_STATUS.SUCCESSFUL
  )
}

export const sendToPurchaseDomainFlow = ({ websiteId, domainName, router }: PurchaseDomainFlowParams): void => {
  const purchaseUrl = `/dashboard/purchase?type=${
    PURCHASE_TYPES.DOMAIN_REGISTRATION
  }&domain=${encodeURIComponent(
    domainName.toLowerCase(),
  )}&websiteId=${websiteId}&returnUrl=${encodeURIComponent(
    '/dashboard/website/domain',
  )}`
  router.push(purchaseUrl)
}
