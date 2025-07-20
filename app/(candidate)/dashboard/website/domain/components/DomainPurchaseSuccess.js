import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import Button from '@shared/buttons/Button'

export default function DomainPurchaseSuccess() {
  return (
    <div className="max-w-2xl mx-auto mt-8 text-center">
      <H1>Domain Purchase Success</H1>
      <Body1 className="my-4">Your domain has been purchased.</Body1>
      <Button href="/dashboard/website">Go to Dashboard</Button>
    </div>
  )
}
