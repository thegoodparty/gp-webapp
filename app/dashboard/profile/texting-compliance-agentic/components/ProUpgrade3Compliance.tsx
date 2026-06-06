'use client'

import { Card } from '@styleguide'

// Placeholder for the pro-upgrade3 post-payment compliance surface. The
// precedence wiring in TextingComplianceFeatureFlag routes the pro-upgrade3
// cohort here now; task 15 replaces this body with the real status states.
export default function ProUpgrade3Compliance(): React.JSX.Element {
  return (
    <Card className="p-4 md:p-6 mt-4 gap-2" id="texting-compliance">
      <h2 className="text-2xl font-semibold mb-4">Texting Compliance</h2>
      <p className="text-sm text-secondary">
        Your Pro upgrade status will appear here.
      </p>
    </Card>
  )
}
