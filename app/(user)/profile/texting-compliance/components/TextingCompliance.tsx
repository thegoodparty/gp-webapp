import Paper from '@shared/utils/Paper'
import H2 from '@shared/typography/H2'
import H3 from '@shared/typography/H3'
import Body2 from '@shared/typography/Body2'
import ComplianceSteps, {
  getTcrComplianceStepCompletions,
  TCR_COMPLIANCE_STATUS as TCR_COMPLIANCE,
} from 'app/(user)/profile/texting-compliance/components/ComplianceSteps'
import { formatPhoneNumber } from 'helpers/numberHelper'
import { HiOutlineCheckBadge } from 'react-icons/hi2'
import { Website } from 'helpers/types'

interface TDlcNumberProps {
  tdlcNumber: string
}

const TDlcNumber = ({ tdlcNumber }: TDlcNumberProps): React.JSX.Element => (
  <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 flex justify-center items-center">
    <span className="font-outfit font-medium text-lg leading-6 text-black w-full text-left block">
      {formatPhoneNumber(tdlcNumber)}
    </span>
  </div>
)

interface TcrCompliance {
  status?: string
  tdlcNumber?: string
}

interface TextingComplianceProps {
  website?: Website | null
  domainStatus?: string | null
  tcrCompliance?: TcrCompliance | null
}

export default function TextingCompliance({
  website,
  domainStatus,
  tcrCompliance,
}: TextingComplianceProps): React.JSX.Element {
  const { status: tcrComplianceStatus, tdlcNumber } = tcrCompliance || {}
  const { websiteComplete, domainComplete, registrationComplete, pinComplete: _pinComplete } =
    getTcrComplianceStepCompletions(website, domainStatus, tcrCompliance)
  const pendingCompliance =
    websiteComplete &&
    domainComplete &&
    registrationComplete &&
    tcrComplianceStatus === TCR_COMPLIANCE.PENDING
  const complianceApproved = tcrComplianceStatus === TCR_COMPLIANCE.APPROVED

  return (
    <Paper className="mt-6" id="texting-compliance">
      <H2 className="mb-6">Texting Compliance</H2>
      <div className="mt-1 mb-6">
        <H3 className="text-gray-900">
          {pendingCompliance ? (
            'Your application is in review'
          ) : complianceApproved ? (
            <span className="flex items-center gap-1">
              <HiOutlineCheckBadge className="inline h-6 w-6" /> Your campaign
              is compliant
            </span>
          ) : (
            '76% of candidates who use our full offering win'
          )}
        </H3>
        <Body2 className="text-gray-600 mt-1">
          {!complianceApproved &&
            (pendingCompliance
              ? 'This can take 3-7 business days. We will send you an email once your campaign is approved, so you can start sending text messages.'
              : 'Start sending 5,000 free targeted text messages by making your campaign compliant in 4 steps.')}
        </Body2>
      </div>
      {complianceApproved && tdlcNumber ? (
        <TDlcNumber {...{ tdlcNumber }} />
      ) : (
        !pendingCompliance &&
        !complianceApproved && (
          <ComplianceSteps {...{ website, domainStatus, tcrCompliance }} />
        )
      )}
    </Paper>
  )
}
