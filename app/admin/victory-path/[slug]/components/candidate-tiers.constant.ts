// Maps display labels to CampaignTier enum values from Prisma
export interface CandidateTiers {
  Review: null
  'Likely to Win': 'WIN'
  'Hard to Call': 'TOSSUP'
  'Likely to Lose': 'LOSE'
}

export const CANDIDATE_TIERS: CandidateTiers = {
  Review: null,
  'Likely to Win': 'WIN',
  'Hard to Call': 'TOSSUP',
  'Likely to Lose': 'LOSE',
}

// Reverse mapping from CampaignTier enum to display label
type CandidateTiersReversedKey = 'null' | 'WIN' | 'TOSSUP' | 'LOSE'

interface CandidateTiersReversed {
  'null': 'Review'
  WIN: 'Likely to Win'
  TOSSUP: 'Hard to Call'
  LOSE: 'Likely to Lose'
}

export const CANDIDATE_TIERS_REVERSED: CandidateTiersReversed = {
  'null': 'Review',
  WIN: 'Likely to Win',
  TOSSUP: 'Hard to Call',
  LOSE: 'Likely to Lose',
}

export const getTierDisplay = (
  tier: string | null | undefined,
): string | undefined => {
  const key = (tier || 'null') as CandidateTiersReversedKey
  return CANDIDATE_TIERS_REVERSED[key]
}
