import { Card } from '@styleguide'
import TextComplianceSteps from './TextComplianceSteps'

export default function TextingComplianceAgentic(): React.JSX.Element {
  return (
    <Card className="p-4 md:p-6 mt-4 gap-2" id="texting-compliance">
      <h2 className="text-2xl font-semibold mb-4">Texting Compliance</h2>
      <p className="text-lg font-medium">
        76% of candidates who use our full offering win
      </p>
      <p className="text-sm text-secondary">
        Start sending 5,000 free targeted text messages by making your campaign
        compliant in 3 steps.
      </p>
      <TextComplianceSteps />
    </Card>
  )
}
