import { Card } from '@styleguide'

export default function TextingComplianceInReview(): React.JSX.Element {
  return (
    <Card className="p-4 md:p-6 mt-4 gap-2" id="texting-compliance">
      <h2 className="text-2xl font-semibold mb-4">Texting Compliance</h2>
      <p className="text-lg font-medium">Your application is in review</p>
      <p className="text-sm text-secondary">
        This can take 3-7 business days. We will send you an email once your
        campaign is approved, so you can start sending text messages.
      </p>
    </Card>
  )
}
