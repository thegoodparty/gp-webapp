import { useFlagOn } from './FeatureFlagsProvider'

// Gates the post-pledge Campaign Plan flow (strategic landscape, community
// events, voter insights, the success page itself). When off, candidates
// land directly in /dashboard after the pledge step and the LLM pre-warm
// calls are skipped. Same key in dev + prod Amplitude environments.
export const CAMPAIGN_STRATEGY_FLAG_KEY = 'campaign-strategy'

interface UseCampaignStrategyFlagResult {
  ready: boolean
  enabled: boolean
}

export const useCampaignStrategyFlag = (): UseCampaignStrategyFlagResult => {
  const { ready, on } = useFlagOn(CAMPAIGN_STRATEGY_FLAG_KEY)
  return { ready, enabled: on }
}
