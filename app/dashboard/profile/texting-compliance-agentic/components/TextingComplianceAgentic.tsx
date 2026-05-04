'use client'

import { BadgeCheck } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@styleguide'
import {
  TCR_COMPLIANCE_QUERY_KEY,
  TCR_COMPLIANCE_STATUS,
  getTcrCompliance,
} from 'app/dashboard/profile/texting-compliance/util/tcrCompliance.util'
import TextComplianceSteps from './TextComplianceSteps'

export default function TextingComplianceAgentic(): React.JSX.Element {
  const { data: tcrCompliance } = useQuery({
    queryKey: TCR_COMPLIANCE_QUERY_KEY,
    queryFn: getTcrCompliance,
  })

  const status = tcrCompliance?.status

  if (status === TCR_COMPLIANCE_STATUS.APPROVED) {
    return (
      <Card className="p-4 md:p-6 mt-4 gap-2" id="texting-compliance">
        <h2 className="text-2xl font-semibold mb-4">Texting Compliance</h2>
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-6 w-6 text-green-600" aria-hidden />
          <p className="text-lg font-medium">Your campaign is compliant</p>
        </div>
      </Card>
    )
  }

  if (status === TCR_COMPLIANCE_STATUS.PENDING) {
    return (
      <Card className="p-4 md:p-6 mt-4 gap-2" id="texting-compliance">
        <h2 className="text-2xl font-semibold mb-4">Texting Compliance</h2>
        <p className="text-lg font-medium">Your application is in review</p>
        <p className="text-sm text-secondary">
          This can take 3-7 business days. We will send you an email once your
          campaign is approved, so you can start sending text messages.
        </p>
      </Card>
    )
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
