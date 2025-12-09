// TODO: Refactor this later once we can finally kill the old modal:
//  https://goodparty.atlassian.net/browse/WEB-4277
const VOTER_FILE_FILTER_KEYS_CONVERSION_MAPPING: Record<string, string> = {
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

export const convertAudienceFiltersForModal = (filters: Record<string, boolean> = {}): Record<string, boolean> =>
  Object.keys(filters).reduce((acc, k) => {
    const convertedKey = VOTER_FILE_FILTER_KEYS_CONVERSION_MAPPING[k] || k
    return {
      ...acc,
      [convertedKey]: filters[k],
    }
  }, {})
