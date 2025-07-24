import ComplianceStep from 'app/(user)/profile/texting-compliance/components/ComplianceStep'

export const STEP_STATUS = {
  DISABLED: 'disabled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

const steps = [
  {
    title: 'Create your website',
    description:
      'Political candidates need to have a campaign website that meets carrier requirements. Our website meets all of these requirements.',
    route: '/dashboard/website',
    status: STEP_STATUS.COMPLETED,
  },
  {
    title: 'Buy a unique domain name',
    description:
      'Political campaigns need a unique domain name to comply with regulations.',
    route: '/dashboard/website/domain',
    status: STEP_STATUS.COMPLETED,
  },
  {
    title: 'Submit your registration',
    description:
      'Every candidate needs to register their campaign information in order to send political text messages.',
    route: '/profile/texting-compliance/register',
    status: STEP_STATUS.ACTIVE,
  },
  {
    title: 'Enter PIN',
    description:
      'To verify your identity you will receive a PIN via email from "CampaignVerify".',
    status: STEP_STATUS.DISABLED,
  },
]

export default function ComplianceSteps() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {steps.map((step, index) => (
        <ComplianceStep key={index} number={index + 1} {...step} />
      ))}
    </div>
  )
}
