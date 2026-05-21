'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@styleguide'
import {
  TCR_COMPLIANCE_QUERY_KEY,
  TCR_COMPLIANCE_STATUS,
  getTcrCompliance,
} from 'app/dashboard/profile/texting-compliance/util/tcrCompliance.util'
import TextComplianceSteps from './TextComplianceSteps'
import TextingComplianceApproved from './TextingComplianceApproved'
import TextingComplianceInReview from './TextingComplianceInReview'

export default function TextingComplianceAgentic(): React.JSX.Element {
  const { data: tcrCompliance, isPending } = useQuery({
    queryKey: TCR_COMPLIANCE_QUERY_KEY,
    queryFn: getTcrCompliance,
  })

  // Render a placeholder shell while loading so we don't flash the default
  // steps view to users who are actually approved or pending review.
  if (isPending) {
    return (
      <Card className="p-4 md:p-6 mt-4 gap-2" id="texting-compliance">
        <h2 className="text-2xl font-semibold mb-4">Texting Compliance</h2>
        <div className="h-6 w-2/3 animate-pulse rounded-md bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded-md bg-slate-200" />
      </Card>
    )
  }

  const status = tcrCompliance?.status

  if (status === TCR_COMPLIANCE_STATUS.APPROVED) {
    return <TextingComplianceApproved />
  }

  if (status === TCR_COMPLIANCE_STATUS.PENDING) {
    return <TextingComplianceInReview />
  }

  return (
    <Card className="p-4 md:p-6 mt-4 gap-2" id="texting-compliance">
      <h2 className="text-2xl font-semibold mb-4">Texting Compliance</h2>
      <p className="text-lg font-medium">
        76% of candidates who use our full offering win
      </p>
      <p className="text-sm text-secondary">
        Start sending 5,000 free targeted text messages by making your campaign
        compliant in 3 steps.
      </p>
      <TextComplianceSteps />
    </Card>
  )
}
