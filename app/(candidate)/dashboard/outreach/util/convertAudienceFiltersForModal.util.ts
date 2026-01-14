import { AudienceFiltersState, AudienceFilterKey } from 'app/(candidate)/dashboard/voter-records/components/CustomVoterAudienceFilters'
import { VoterFileFilters } from 'helpers/types'

const VOTER_FILE_FILTER_KEYS_CONVERSION_MAPPING: Partial<Record<keyof VoterFileFilters, AudienceFilterKey>> = {
  audienceSuperVoters: 'audience_superVoters',
  audienceLikelyVoters: 'audience_likelyVoters',
  audienceUnreliableVoters: 'audience_unreliableVoters',
  audienceUnlikelyVoters: 'audience_unlikelyVoters',
  audienceFirstTimeVoters: 'audience_firstTimeVoters',
  partyIndependent: 'party_independent',
  partyDemocrat: 'party_democrat',
  partyRepublican: 'party_republican',
  age18_25: 'age_18_25',
  age25_35: 'age_25_35',
  age35_50: 'age_35_50',
  age50Plus: 'age_50_plus',
  genderMale: 'gender_male',
  genderFemale: 'gender_female',
}

const isConvertibleFilterKey = (key: string): key is keyof typeof VOTER_FILE_FILTER_KEYS_CONVERSION_MAPPING =>
  key in VOTER_FILE_FILTER_KEYS_CONVERSION_MAPPING

export const convertAudienceFiltersForModal = (
  filters: VoterFileFilters = {}
): AudienceFiltersState => {
  const result: AudienceFiltersState = {}
  for (const key of Object.keys(filters)) {
    if (isConvertibleFilterKey(key)) {
      const convertedKey = VOTER_FILE_FILTER_KEYS_CONVERSION_MAPPING[key]
      const value = filters[key]
      if (convertedKey && typeof value === 'boolean') {
        result[convertedKey] = value
      }
    }
  }
  return result
}
