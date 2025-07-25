import ComplianceStep from 'app/(user)/profile/texting-compliance/components/ComplianceStep'
import { WEBSITE_STATUS } from 'app/(candidate)/dashboard/website/util/website.util'
import { DOMAIN_STATUS } from 'app/(candidate)/dashboard/website/util/domain.util'

export const STEP_STATUS = {
  DISABLED: 'disabled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

export const TCR_COMPLIANCE_STATUS = {
  SUBMITTED: 'submitted',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ERROR: 'error',
}

const getSteps = (website, domainStatus, tcrCompliance) => {
  const publishedWebsite = website?.status === WEBSITE_STATUS.published
  const domainSuccessful = domainStatus.message === DOMAIN_STATUS.SUCCESSFUL
  const registrationComplete = [
    TCR_COMPLIANCE_STATUS.SUBMITTED,
    TCR_COMPLIANCE_STATUS.PENDING,
    TCR_COMPLIANCE_STATUS.APPROVED,
  ].includes(tcrCompliance?.status)

  const websiteStepStatus = publishedWebsite
    ? STEP_STATUS.COMPLETED
    : STEP_STATUS.ACTIVE
  const domainStepStatus =
    publishedWebsite && !domainSuccessful
      ? STEP_STATUS.ACTIVE
      : publishedWebsite && domainSuccessful
      ? STEP_STATUS.COMPLETED
      : STEP_STATUS.DISABLED
  const activateRegisterStep =
    publishedWebsite && domainSuccessful && !registrationComplete
  const registerStepStatus = registrationComplete
    ? STEP_STATUS.COMPLETED
    : activateRegisterStep
    ? STEP_STATUS.ACTIVE
    : STEP_STATUS.DISABLED
  const enterPinStepStatus = registrationComplete
    ? STEP_STATUS.ACTIVE
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
        'To verify your identity you will receive a PIN via email from "CampaignVerify".',
      route: '/profile/texting-compliance/submit-pin',
      status: enterPinStepStatus,
    },
  ]
}

const ComplianceSteps = ({ website, domainStatus, tcrCompliance }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    {getSteps(website, domainStatus, tcrCompliance).map((step, index) => (
      <ComplianceStep key={index} number={index + 1} {...step} />
    ))}
  </div>
)
export default ComplianceSteps
