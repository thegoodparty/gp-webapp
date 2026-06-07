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
  const { ready, enabled: proUpgrade3Enabled } = useProUpgrade3Flag()
  const { enabled: proUpgrade1Enabled } = useProUpgradeFlag()

  // Precedence: pro-upgrade3 > pro-upgrade1 > legacy. Gate on `ready` first:
  // `useFlagOn` does not tie `on` to `ready`, so a cached/early variant could
  // otherwise flash a flagged surface before Amplitude resolves. Both flags
  // come from the same client, so one `ready` covers both; until it resolves
  // (and for the off cohort) the legacy surface renders.
  if (!ready) {
    return <TextingCompliance {...props} />
  }

  if (proUpgrade3Enabled) {
    return <ProUpgrade3Compliance />
  }

  if (proUpgrade1Enabled) {
    return <TextingComplianceAgentic />
  }

  return <TextingCompliance {...props} />
}
