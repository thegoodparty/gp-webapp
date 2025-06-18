import Body2 from '@shared/typography/Body2'
import H1 from '@shared/typography/H1'

export default function EmptyOutreachHero() {
  return (
    <header className="w-full flex flex-col items-center justify-center pt-16 pb-8 px-4">
      <H1 className="text-center mb-4">Create your first campaign</H1>
      <Body2 className="text-gray-600 text-center max-w-md">
        Launch targeted outreach to engage your community, earn trust, and
        secure the votes you need. Your message matters – but only if people
        hear it.
      </Body2>
    </header>
  )
}
