import Paper from '@shared/utils/Paper'
import Body1 from '@shared/typography/Body1'
import H3 from '@shared/typography/H3'
import Link from 'next/link'

export default function ComplianceRejection() {
  return (
    <Paper>
      <div className="py-4 md:py-12 lg:py-24 flex flex-col items-center">
        <H3 className="mt-8 mb-4">
          Your 10DLC compliance application was rejected.
        </H3>
        <Body1 className="mb-8 max-w-lg text-center px-2">
          Please contact us at&nbsp;
          <Link href="mailto:support@goodparty.org" className="text-blue">
            support@goodparty.org
          </Link>
          &nbsp;for more information.
        </Body1>
      </div>
    </Paper>
  )
}
