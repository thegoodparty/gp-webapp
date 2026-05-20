import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import type { TcrCompliance, TcrComplianceStatus } from 'helpers/types'

export const TCR_COMPLIANCE_QUERY_KEY = ['tcrCompliance'] as const

export const TCR_COMPLIANCE_STATUS: {
  SUBMITTED: 'submitted'
  PENDING: 'pending'
  APPROVED: 'approved'
  REJECTED: 'rejected'
  ERROR: 'error'
} = {
  SUBMITTED: 'submitted',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ERROR: 'error',
}

// Statuses that mean the registration form has been submitted (peerly may
// still be processing).
const FILING_COMPLETE_STATUSES: TcrComplianceStatus[] = [
  TCR_COMPLIANCE_STATUS.SUBMITTED,
  TCR_COMPLIANCE_STATUS.PENDING,
  TCR_COMPLIANCE_STATUS.APPROVED,
]

// Statuses that mean PIN verification has happened (or is no longer required).
const PIN_COMPLETE_STATUSES: TcrComplianceStatus[] = [
  TCR_COMPLIANCE_STATUS.PENDING,
  TCR_COMPLIANCE_STATUS.APPROVED,
]

export interface TcrComplianceStatusCompletions {
  filingComplete: boolean
  pinComplete: boolean
}

export const getTcrComplianceStatusCompletions = (
  tcrCompliance: TcrCompliance | null | undefined,
): TcrComplianceStatusCompletions => {
  const status = tcrCompliance?.status ?? null
  return {
    filingComplete:
      status !== null && FILING_COMPLETE_STATUSES.includes(status),
    pinComplete: status !== null && PIN_COMPLETE_STATUSES.includes(status),
  }
}

export const getTcrCompliance = async (): Promise<TcrCompliance | null> => {
  const response = await clientFetch<TcrCompliance | null>(
    apiRoutes.campaign.tcrCompliance.fetch,
  )
  if (!response.ok) return null
  return response.data ?? null
}
