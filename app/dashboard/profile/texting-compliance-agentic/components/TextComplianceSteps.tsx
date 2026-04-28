import { STEP_STATUS, StepStatus } from '../shared/TextCompliance.types'
import TextComplianceStep from './TextComplianceStep'

interface Step {
  title: string
  route: string
  status: StepStatus
}

// TODO: make these steps dynamic based on the user's progress
const STEPS: Step[] = [
  {
    title: 'Submit candidate profile',
    route: '/dashboard/profile/texting-compliance/submit-candidate-profile',
    status: STEP_STATUS.ACTIVE,
  },
  {
    title: 'Submit election filing details',
    route: '/dashboard/profile/texting-compliance/election-filing',
    status: STEP_STATUS.DISABLED,
  },
  {
    title: 'Enter your PIN',
    route: '/dashboard/profile/texting-compliance/enter-pin',
    status: STEP_STATUS.DISABLED,
  },
]

export default function TextComplianceSteps(): React.JSX.Element {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mt-6">
      {STEPS.map((step, index) => (
        <TextComplianceStep
          key={step.route}
          number={index + 1}
          total={STEPS.length}
          {...step}
        />
      ))}
    </div>
  )
}
