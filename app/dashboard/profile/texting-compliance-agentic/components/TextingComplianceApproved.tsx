import { BadgeCheck } from 'lucide-react'
import { Card } from '@styleguide'

export default function TextingComplianceApproved(): React.JSX.Element {
  return (
    <Card className="p-4 md:p-6 mt-4 gap-2" id="texting-compliance">
      <h2 className="text-2xl font-semibold mb-4">Texting Compliance</h2>
      <div className="flex items-center gap-2">
        <BadgeCheck className="h-6 w-6 text-green-600" aria-hidden />
        <p className="text-lg font-medium">Your campaign is compliant</p>
      </div>
    </Card>
  )
}
