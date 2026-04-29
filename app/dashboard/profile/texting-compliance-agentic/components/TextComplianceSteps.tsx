'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import { isCandidateProfileComplete } from 'app/dashboard/profile/texting-compliance/candidate-profile/candidateProfile.utils'
import { STEP_STATUS, StepStatus } from '../shared/TextCompliance.types'
import TextComplianceStep from './TextComplianceStep'

interface Step {
  title: string
  route: string
  status: StepStatus
}

export default function TextComplianceSteps(): React.JSX.Element {
  const [campaign] = useCampaign()
  const candidateProfileComplete = isCandidateProfileComplete(campaign)

  const steps: Step[] = [
    {
      title: 'Submit candidate profile',
      route: '/dashboard/profile/texting-compliance/candidate-profile',
      status: candidateProfileComplete
        ? STEP_STATUS.COMPLETED
        : STEP_STATUS.ACTIVE,
    },
    {
      title: 'Submit election filing details',
      route: '/dashboard/profile/texting-compliance/election-filing',
      status: candidateProfileComplete
        ? STEP_STATUS.ACTIVE
        : STEP_STATUS.DISABLED,
    },
    {
      title: 'Enter your PIN',
      route: '/dashboard/profile/texting-compliance/enter-pin',
      status: STEP_STATUS.DISABLED,
    },
  ]

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mt-6">
      {steps.map((step, index) => (
        <TextComplianceStep
          key={step.route}
          number={index + 1}
          total={steps.length}
          {...step}
        />
      ))}
    </div>
  )
}
