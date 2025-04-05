import { reverseObject } from './reverseObject.util'

export const CANDIDATE_TIERS = {
  Review: null,
  'Likely to Win': 'WIN',
  'Hard to Call': 'TOSSUP',
  'Likely to Lose': 'LOSE',
}
export const CANDIDATE_TIERS_REVERSED = reverseObject(CANDIDATE_TIERS)
