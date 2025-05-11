import Paper from '@shared/utils/Paper'
import Body1 from '@shared/typography/Body1'
import H3 from '@shared/typography/H3'

export default function ComplianceApproval() {
  return (
    <Paper>
      <div className="py-4 md:py-12 lg:py-24 flex flex-col items-center">
        <H3 className="mt-8 mb-4">Waiting for final approval</H3>
        <Body1 className="mb-8 max-w-lg text-center px-2">
          The Campaign Registry will review your application and approve or
          reject it. You will receive an email notification once the review is
          complete.
        </Body1>
      </div>
    </Paper>
  )
}
