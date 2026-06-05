import H1 from '@shared/typography/H1'
import H2 from '@shared/typography/H2'
import Link from 'next/link'
import { Button } from '@styleguide'

export const AlreadyProUserPrompt = (): React.JSX.Element => (
  <>
    <H1 className="text-center mb-8">You&apos;re already a Pro Plan user!</H1>
    <H2 className="text-center mb-8">
      Thank you! <span className="text-4xl">👏</span>
    </H2>
    <Button asChild variant="secondary" className="mx-auto block w-fit">
      <Link href="/dashboard">Go Back to your Dashboard</Link>
    </Button>
  </>
)
