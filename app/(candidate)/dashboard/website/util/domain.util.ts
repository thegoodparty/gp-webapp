import { PURCHASE_TYPES } from 'helpers/purchaseTypes'

// Flexible object type per project guidelines (no any/unknown)
type FlexibleObject = {
  [key: string]: string | number | boolean | object | null | undefined
}

export const PAYMENT_STATUS = {
  REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
  REQUIRES_CONFIRMATION: 'requires_confirmation',
  REQUIRES_ACTION: 'requires_action',
  PROCESSING: 'processing',
  REQUIRES_CAPTURE: 'requires_capture',
  CANCELED: 'canceled',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

export const DOMAIN_STATUS = {
  NO_DOMAIN: 'NO_DOMAIN',
  SUBMITTED: 'SUBMITTED',
  IN_PROGRESS: 'IN_PROGRESS',
  INACTIVE: 'INACTIVE',
  ERROR: 'ERROR',
  SUCCESSFUL: 'SUCCESSFUL',
} as const

export type DomainStatus = (typeof DOMAIN_STATUS)[keyof typeof DOMAIN_STATUS]

export interface Domain extends FlexibleObject {
  name?: string
  status?: string
}

export function isDomainActive(domain: Domain | null | undefined = {}): boolean {
  const status = domain?.status ? domain.status.toUpperCase() : null
  return isDomainStatusActive(status || undefined)
}

export function isDomainStatusActive(status?: string): boolean {
  if (!status) {
    return false
  }

  return (
    status === DOMAIN_STATUS.SUBMITTED || status === DOMAIN_STATUS.SUCCESSFUL
  )
}

interface RouterLike {
  push: (href: string) => void
}

export const sendToPurchaseDomainFlow = ({
  websiteId,
  domainName,
  router,
}: {
  websiteId: string | number
  domainName: string
  router: RouterLike
}) => {
  const purchaseUrl = `/dashboard/purchase?type=${
    PURCHASE_TYPES.DOMAIN_REGISTRATION
  }&domain=${encodeURIComponent(
    domainName.toLowerCase(),
  )}&websiteId=${websiteId}&returnUrl=${encodeURIComponent(
    '/dashboard/website/domain',
  )}`
  router.push(purchaseUrl)
}
