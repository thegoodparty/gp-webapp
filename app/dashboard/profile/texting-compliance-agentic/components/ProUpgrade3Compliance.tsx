'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@styleguide'
import {
  TCR_COMPLIANCE_QUERY_KEY,
  TCR_COMPLIANCE_STATUS,
  getTcrCompliance,
} from 'app/dashboard/profile/texting-compliance/util/tcrCompliance.util'
import ProUpgrade3PinEntry from './ProUpgrade3PinEntry'
import TextingComplianceApproved from './TextingComplianceApproved'
import TextingComplianceDenied from './TextingComplianceDenied'
import TextingComplianceInReview from './TextingComplianceInReview'

// Post-payment compliance surface for the pro-upgrade3 cohort. The agent
// provisions the domain/site and submits TCR to Peerly after payment; this
// card only reflects the TCR record's status, it does not drive the agent.
export default function ProUpgrade3Compliance(): React.JSX.Element {
  const { data: tcrCompliance, isPending } = useQuery({
    queryKey: TCR_COMPLIANCE_QUERY_KEY,
    queryFn: getTcrCompliance,
  })

  // Hold a placeholder shell while loading so we don't flash the neutral
  // fallback to a candidate who is actually awaiting-PIN / in review / etc.
  if (isPending) {
    return (
      <Card className="p-4 md:p-6 mt-4 gap-2" id="texting-compliance">
        <h2 className="text-2xl font-semibold mb-4">Texting Compliance</h2>
        <div className="h-6 w-2/3 animate-pulse rounded-md bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded-md bg-slate-200" />
      </Card>
    )
  }

  if (tcrCompliance) {
    switch (tcrCompliance.status) {
      case TCR_COMPLIANCE_STATUS.SUBMITTED:
        return <ProUpgrade3PinEntry tcrCompliance={tcrCompliance} />
      case TCR_COMPLIANCE_STATUS.PENDING:
        return (
          <TextingComplianceInReview
            title="Your candidate profile is being reviewed"
            description="Review takes 3-7 business days. We’ll email you when you’re ready to send texts."
          />
        )
      case TCR_COMPLIANCE_STATUS.APPROVED:
        return (
          <TextingComplianceApproved title="Your profile has been approved!" />
        )
      case TCR_COMPLIANCE_STATUS.REJECTED:
        return <TextingComplianceDenied />
    }
  }

  // No TCR record yet (or an `error`/unknown status) — the agent kicks off on
  // payment, so the record may not exist for a beat. Show a neutral holding
  // state rather than a blank or stuck card.
  return (
    <Card className="p-4 md:p-6 mt-4 gap-2" id="texting-compliance">
      <h2 className="text-2xl font-semibold mb-4">Texting Compliance</h2>
      <p className="text-sm text-secondary">
        Your Pro upgrade status will appear here.
      </p>
    </Card>
  )
}
