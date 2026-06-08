import { useFlagOn } from './FeatureFlagsProvider'

export const PRO_UPGRADE3_FLAG_KEY = 'pro-upgrade3'

interface UseProUpgrade3FlagResult {
  ready: boolean
  enabled: boolean
}

export const useProUpgrade3Flag = (): UseProUpgrade3FlagResult => {
  const { ready, on } = useFlagOn(PRO_UPGRADE3_FLAG_KEY)
  return { ready, enabled: on }
}
