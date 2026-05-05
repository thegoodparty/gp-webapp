import { useFlagOn } from './FeatureFlagsProvider'

export const PRO_UPGRADE_FLAG_KEY = 'pro-upgrade1'

interface UseProUpgradeFlagResult {
  ready: boolean
  enabled: boolean
}

export const useProUpgradeFlag = (): UseProUpgradeFlagResult => {
  const { ready, on } = useFlagOn(PRO_UPGRADE_FLAG_KEY)
  return { ready, enabled: on }
}
