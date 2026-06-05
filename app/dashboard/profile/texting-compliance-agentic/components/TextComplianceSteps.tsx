'use client'
import { useQuery } from '@tanstack/react-query'
import {
  getUserWebsite,
  USER_WEBSITE_QUERY_KEY,
} from 'app/dashboard/website/util/website.util'
import { isCandidateProfileComplete } from 'app/dashboard/profile/texting-compliance/candidate-profile/candidateProfile.utils'
import {
  getTcrCompliance,
  getTcrComplianceStatusCompletions,
  TCR_COMPLIANCE_QUERY_KEY,
} from 'app/dashboard/profile/texting-compliance/util/tcrCompliance.util'
import { STEP_STATUS, StepStatus } from '../shared/TextCompliance.types'
import TextComplianceStep from './TextComplianceStep'

interface Step {
  title: string
  route: string
  status: StepStatus
}

export default function TextComplianceSteps(): React.JSX.Element {
  const { data: website } = useQuery({
    queryKey: USER_WEBSITE_QUERY_KEY,
    queryFn: getUserWebsite,
  })
  // Gate downstream step status on `isPending` so the user does not see a
  // freshly-submitted filing render as ACTIVE for one frame before the cache
  // resolves to COMPLETED.
  const { data: tcrCompliance, isPending: tcrCompliancePending } = useQuery({
    queryKey: TCR_COMPLIANCE_QUERY_KEY,
    queryFn: getTcrCompliance,
  })

  const candidateProfileComplete = isCandidateProfileComplete(website)
  const { filingComplete, pinComplete } =
    getTcrComplianceStatusCompletions(tcrCompliance)

  const electionFilingStatus: StepStatus = tcrCompliancePending
    ? STEP_STATUS.DISABLED
    : filingComplete
    ? STEP_STATUS.COMPLETED
    : candidateProfileComplete
    ? STEP_STATUS.ACTIVE
    : STEP_STATUS.DISABLED

  const pinStatus: StepStatus = tcrCompliancePending
    ? STEP_STATUS.DISABLED
    : pinComplete
    ? STEP_STATUS.COMPLETED
    : filingComplete
    ? STEP_STATUS.ACTIVE
    : STEP_STATUS.DISABLED

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
      status: electionFilingStatus,
    },
    {
      title: 'Enter your PIN',
      route: '/dashboard/profile/texting-compliance/enter-pin',
      status: pinStatus,
    },
  ]

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
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
