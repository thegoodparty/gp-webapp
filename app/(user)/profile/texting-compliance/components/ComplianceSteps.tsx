import ComplianceStep from 'app/(user)/profile/texting-compliance/components/ComplianceStep'
import { WEBSITE_STATUS } from 'app/(candidate)/dashboard/website/util/website.util'
import { isDomainStatusActive } from 'app/(candidate)/dashboard/website/util/domain.util'
import { Website } from 'helpers/types'

export const STEP_STATUS: {
  DISABLED: 'disabled'
  ACTIVE: 'active'
  COMPLETED: 'completed'
} = {
  DISABLED: 'disabled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

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

// domainStatus can be either a string (the message directly) or an object with a message property
type DomainStatus = string | { message?: string }

interface TcrCompliance {
  status?: string
}

interface StepCompletions {
  websiteComplete: boolean
  domainComplete: boolean
  registrationComplete: boolean
  pinComplete: boolean
}

export const getTcrComplianceStepCompletions = (
  website: Website | null | undefined,
  domainStatus: DomainStatus | null | undefined,
  tcrCompliance: TcrCompliance | null | undefined,
): StepCompletions => {
  const websiteComplete = website?.status === WEBSITE_STATUS.published
  const domainMessage = typeof domainStatus === 'string' ? domainStatus : domainStatus?.message
  const domainComplete = isDomainStatusActive(domainMessage ?? null)

  const tcrStatus = tcrCompliance?.status
  const registrationStatuses: string[] = [
    TCR_COMPLIANCE_STATUS.SUBMITTED,
    TCR_COMPLIANCE_STATUS.PENDING,
    TCR_COMPLIANCE_STATUS.APPROVED,
  ]
  const pinStatuses: string[] = [
    TCR_COMPLIANCE_STATUS.PENDING,
    TCR_COMPLIANCE_STATUS.APPROVED,
  ]
  const registrationComplete = tcrStatus !== undefined && registrationStatuses.includes(tcrStatus)
  const pinComplete = tcrStatus !== undefined && pinStatuses.includes(tcrStatus)

  return {
    websiteComplete,
    domainComplete,
    registrationComplete,
    pinComplete,
  }
}

interface Step {
  title: string
  description: string
  route: string
  status: typeof STEP_STATUS[keyof typeof STEP_STATUS]
}

const getSteps = (
  website: Website | null | undefined,
  domainStatus: DomainStatus | null | undefined,
  tcrCompliance: TcrCompliance | null | undefined,
): Step[] => {
  const { websiteComplete, domainComplete, registrationComplete, pinComplete } =
    getTcrComplianceStepCompletions(website, domainStatus, tcrCompliance)

  const websiteStepStatus = websiteComplete
    ? STEP_STATUS.COMPLETED
    : STEP_STATUS.ACTIVE
  const domainStepStatus =
    websiteComplete && !domainComplete
      ? STEP_STATUS.ACTIVE
      : websiteComplete && domainComplete
      ? STEP_STATUS.COMPLETED
      : STEP_STATUS.DISABLED
  const activateRegisterStep =
    websiteComplete && domainComplete && !registrationComplete
  const registerStepStatus = registrationComplete
    ? STEP_STATUS.COMPLETED
    : activateRegisterStep
    ? STEP_STATUS.ACTIVE
    : STEP_STATUS.DISABLED
  const enterPinStepStatus = registrationComplete
    ? STEP_STATUS.ACTIVE
    : pinComplete
    ? STEP_STATUS.COMPLETED
    : STEP_STATUS.DISABLED

  return [
    {
      title: 'Create your website',
      description:
        'Political candidates need to have a campaign website that meets carrier requirements. Our website meets all of these requirements.',
      route: '/dashboard/website',
      status: websiteStepStatus,
    },
    {
      title: 'Buy a unique domain name',
      description:
        'Political campaigns need a unique domain name to comply with regulations.',
      route: '/dashboard/website/domain',
      status: domainStepStatus,
    },
    {
      title: 'Submit your registration',
      description:
        'Every candidate needs to register their campaign information in order to send political text messages.',
      route: '/profile/texting-compliance/register',
      status: registerStepStatus,
    },
    {
      title: 'Enter PIN',
      description:
        'To verify your identity you will be sent a PIN within 2-3 business days to either your email, phone or address from "CampaignVerify" that matches your election filing',
      route: '/profile/texting-compliance/submit-pin',
      status: enterPinStepStatus,
    },
  ]
}

interface ComplianceStepsProps {
  website: Website | null | undefined
  domainStatus: DomainStatus | null | undefined
  tcrCompliance: TcrCompliance | null | undefined
}

const ComplianceSteps = ({ website, domainStatus, tcrCompliance }: ComplianceStepsProps): React.JSX.Element => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    {getSteps(website, domainStatus, tcrCompliance).map((step, index) => (
      <ComplianceStep key={index} number={index + 1} {...step} />
    ))}
  </div>
)
export default ComplianceSteps
