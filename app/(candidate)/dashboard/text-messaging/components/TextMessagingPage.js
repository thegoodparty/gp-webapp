'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import { TextMessagingProvider } from 'app/shared/hooks/TextMessagingProvider'
import NoCompliance from './NoCompliance'
import { StyledAlert } from '@shared/alerts/StyledAlert'

// NOTE: copy/pasted from gp-api TcrComplianceStatus enum
export const COMPLIANCE_STATUSES = {
  /** Form submitted, awaiting PIN confirmation */
  submitted: 'submitted',
  /** PIN confirmed, awaiting approval */
  pending: 'pending',
  /** Approved */
  approved: 'approved',
  /** Rejected */
  rejected: 'rejected',
  /** Error */
  error: 'error',
}

export default function TextMessagingPage({
  pathname,
  campaign,
  textMessaging,
}) {
  const complianceStatus = campaign?.data?.tcrComplianceInfo?.status
  return (
    <TextMessagingProvider textMessaging={textMessaging}>
      <DashboardLayout
        pathname={pathname}
        campaign={campaign}
        showAlert={false}
      >
        <StyledAlert severity="warning" className="flex items-center mb-4">
          This is visible for admins only
        </StyledAlert>
        {!complianceStatus ? (
          <NoCompliance />
        ) : complianceStatus === COMPLIANCE_STATUSES.submitted ? (
          <>Form submitted, awaiting PIN!!!</>
        ) : complianceStatus === COMPLIANCE_STATUSES.pending ? (
          <>PIN confirmed, awaiting final approval!!!</>
        ) : complianceStatus === COMPLIANCE_STATUSES.approved ? (
          <>Approved!!!</>
        ) : (
          <>Rejected!!!</>
        )}
      </DashboardLayout>
    </TextMessagingProvider>
  )
}
