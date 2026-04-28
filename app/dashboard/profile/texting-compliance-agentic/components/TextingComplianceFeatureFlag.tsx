'use client'

import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'
import TextingCompliance, {
  TextingComplianceProps,
} from 'app/dashboard/profile/texting-compliance/components/TextingCompliance'
import TextingComplianceAgentic from './TextingComplianceAgentic'

const TEXT_COMPLIANCE_FEATURE_FLAG_KEY = 'pro-upgrade1'

export default function TextingComplianceFeatureFlag(
  props: TextingComplianceProps,
): React.JSX.Element {
  const { ready, on: textComplianceFeatureFlagEnabled } = useFlagOn(
    TEXT_COMPLIANCE_FEATURE_FLAG_KEY,
  )

  if (!ready || !textComplianceFeatureFlagEnabled) {
    return <TextingCompliance {...props} />
  }

  return <TextingComplianceAgentic />
}
