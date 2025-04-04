import H1 from '@shared/typography/H1'
import H2 from '@shared/typography/H2'
import Link from 'next/link'
import SecondaryButton from '@shared/buttons/SecondaryButton'

export const AlreadyProUserPrompt = () => (
  <>
    <H1 className="text-center mb-8">You&apos;re already a Pro Plan user!</H1>
    <H2 className="text-center mb-8">
      Thank you! <span className="text-4xl">👏</span>
    </H2>
    <Link href="/dashboard" className="mx-auto block w-fit">
      <SecondaryButton className="">Go Back to your Dashboard</SecondaryButton>
    </Link>
  </>
)
