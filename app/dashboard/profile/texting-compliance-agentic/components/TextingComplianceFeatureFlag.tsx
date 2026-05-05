'use client'

import { useProUpgradeFlag } from '@shared/experiments/proUpgradeFlag'
import TextingCompliance, {
  TextingComplianceProps,
} from 'app/dashboard/profile/texting-compliance/components/TextingCompliance'
import TextingComplianceAgentic from './TextingComplianceAgentic'

export default function TextingComplianceFeatureFlag(
  props: TextingComplianceProps,
): React.JSX.Element {
  const { ready, enabled } = useProUpgradeFlag()

  if (!ready || !enabled) {
    return <TextingCompliance {...props} />
  }

  return <TextingComplianceAgentic />
}
