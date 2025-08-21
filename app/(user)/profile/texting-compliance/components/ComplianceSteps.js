import ComplianceStep from 'app/(user)/profile/texting-compliance/components/ComplianceStep'
import { WEBSITE_STATUS } from 'app/(candidate)/dashboard/website/util/website.util'
import { DOMAIN_STATUS } from 'app/(candidate)/dashboard/website/util/domain.util'
import { MATCHING_COMPLIANCE_FIELDS_VALUE } from 'app/(user)/profile/texting-compliance/register/components/MatchingComplianceContactFields'

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

export const getTcrComplianceStepCompletions = (
  website,
  domainStatus,
  tcrCompliance,
) => {
  const websiteComplete = website?.status === WEBSITE_STATUS.published
  const domainComplete = domainStatus?.message === DOMAIN_STATUS.SUCCESSFUL
  const registrationComplete = [
    TCR_COMPLIANCE_STATUS.SUBMITTED,
    TCR_COMPLIANCE_STATUS.PENDING,
    TCR_COMPLIANCE_STATUS.APPROVED,
  ].includes(tcrCompliance?.status)
  const pinComplete = [
    TCR_COMPLIANCE_STATUS.PENDING,
    TCR_COMPLIANCE_STATUS.APPROVED,
  ].includes(tcrCompliance?.status)

  return {
    websiteComplete,
    domainComplete,
    registrationComplete,
    pinComplete,
  }
}

const getCVPinDeliveryType = (matchingContactFields = []) =>
  matchingContactFields.includes(MATCHING_COMPLIANCE_FIELDS_VALUE.PHONE)
    ? 'text'
    : matchingContactFields.includes(MATCHING_COMPLIANCE_FIELDS_VALUE.EMAIL)
    ? 'email'
    : 'mail'

const getSteps = (website, domainStatus, tcrCompliance) => {
  const { websiteComplete, domainComplete, registrationComplete, pinComplete } =
    getTcrComplianceStepCompletions(website, domainStatus, tcrCompliance)
  const { matchingContactFields = [] } = tcrCompliance || {}

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
      description: `To verify your identity you will receive a PIN via ${getCVPinDeliveryType(
        matchingContactFields,
      )} from "CampaignVerify".`,
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
