import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import H3 from '@shared/typography/H3'
import Body2 from '@shared/typography/Body2'
import ComplianceSteps from 'app/(user)/profile/texting-compliance/components/ComplianceSteps'

export default function TextingCompliance({
  website,
  domainStatus,
  tcrCompliance,
}) {
  return (
    <Paper className="mt-6">
      <H2>Texting Compliance</H2>
      <div className="mt-1 mb-6">
        <H3 className="text-gray-900">
          76% of candidates who use our full offering win
        </H3>
        <Body2 className="text-gray-600 mt-1">
          Start sending 5,000 free targeted text messages by making your
          campaign compliant in 4 steps.
        </Body2>
      </div>
      <ComplianceSteps {...{ website, domainStatus, tcrCompliance }} />
    </Paper>
  )
}
