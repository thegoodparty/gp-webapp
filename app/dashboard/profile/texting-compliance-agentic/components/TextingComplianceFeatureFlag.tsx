'use client'

import { useProUpgrade3Flag } from '@shared/experiments/proUpgrade3Flag'
import { useProUpgradeFlag } from '@shared/experiments/proUpgradeFlag'
import TextingCompliance, {
  TextingComplianceProps,
} from 'app/dashboard/profile/texting-compliance/components/TextingCompliance'
import TextingComplianceAgentic from './TextingComplianceAgentic'
import ProUpgrade3Compliance from './ProUpgrade3Compliance'

export default function TextingComplianceFeatureFlag(
  props: TextingComplianceProps,
): React.JSX.Element {
  const { enabled: proUpgrade3Enabled } = useProUpgrade3Flag()
  const { enabled: proUpgrade1Enabled } = useProUpgradeFlag()

  // Precedence: pro-upgrade3 > pro-upgrade1 > legacy. Both variants default to
  // "off" until the Amplitude client resolves, so the legacy surface shows
  // during load and the flagged surfaces appear only once a variant is known.
  if (proUpgrade3Enabled) {
    return <ProUpgrade3Compliance />
  }

  if (proUpgrade1Enabled) {
    return <TextingComplianceAgentic />
  }

  return <TextingCompliance {...props} />
}
