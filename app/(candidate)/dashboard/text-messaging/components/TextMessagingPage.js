'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import { TextMessagingProvider } from 'app/shared/hooks/TextMessagingProvider'
import NoCompliance from './NoCompliance'
import { StyledAlert } from '@shared/alerts/StyledAlert'
import TextMessagingRequests from './TextMessagingRequests'
import CompliancePin from './CompliancePin'
import ComplianceApproval from './ComplianceApproval'
import { useCampaign } from '@shared/hooks/useCampaign'
import ComplianceRejection from './ComplianceRejection'
import ComplianceError from './ComplianceError'

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
  campaign: propCampaign,
  textMessaging,
}) {
  const [hookCampaign] = useCampaign()

  const campaign = hookCampaign ?? propCampaign
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
          <CompliancePin />
        ) : complianceStatus === COMPLIANCE_STATUSES.pending ? (
          <ComplianceApproval />
        ) : complianceStatus === COMPLIANCE_STATUSES.approved ? (
          <TextMessagingRequests />
        ) : complianceStatus === COMPLIANCE_STATUSES.rejected ? (
          <ComplianceRejection />
        ) : (
          <ComplianceError />
        )}
      </DashboardLayout>
    </TextMessagingProvider>
  )
}
