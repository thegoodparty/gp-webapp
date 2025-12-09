'use client'
import H4 from '@shared/typography/H4'
import { useOutreach } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'

export const OutreachHeader = (): React.JSX.Element => {
  const [outreaches] = useOutreach()
  return !outreaches?.length ? (
    <header className="w-full flex flex-col lg:items-center lg:justify-center pt-16 pb-8 px-4">
      <H1 className="lg:text-center mb-4">Create your first campaign</H1>
      <Body2 className="text-gray-600 lg:text-center max-w-md">
        Launch targeted outreach to engage your community, earn trust, and
        secure the votes you need. Your message matters – but only if people
        hear it.
      </Body2>
    </header>
  ) : (
    <header className="mb-4 pt-4">
      <H4>Create a new campaign</H4>
    </header>
  )
}

export default OutreachHeader
