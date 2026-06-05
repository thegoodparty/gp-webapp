'use client'
import CheckmarkAnimation from '@shared/animations/CheckmarkAnimation'
import { Button } from '@styleguide'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import { useUser } from '@shared/hooks/useUser'
import Link from 'next/link'

interface NeedHelpSuccessProps {
  closeCallback: () => void
}

export default function NeedHelpSuccess({
  closeCallback,
}: NeedHelpSuccessProps): React.JSX.Element {
  const [user] = useUser()
  return (
    <div className="text-center">
      <H1>Request Submitted</H1>
      <Body1 className="mt-4 mb-2">
        A confirmation has been sent to{' '}
        <span className="font-bold">{user?.email}</span>.<br />
        We will be reaching out to you shortly.
      </Body1>

      <div className="max-w-xs m-auto">
        <CheckmarkAnimation />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 text-left mt-3">
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
        <div className="col-span-6 text-right mt-3">
          <Button asChild className="w-full">
            <Link href="/dashboard/voter-records" onClick={closeCallback}>
              Return to Voter File
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
