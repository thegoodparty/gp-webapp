import { voterFileDownload } from 'helpers/voterFileDownload'

// Mapping from old format (camelCase) to new format (underscore) - only for filter keys
const FILTER_KEY_MAPPING = {
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
  genderUnknown: 'gender_unknown',
}

export const downloadVoterList = async (
  { voterFileFilter = {}, outreachType = '' } = {},
  setLoading = () => {},
  errorSnackbar = () => {},
) => {
  setLoading(true)
  
  // Convert only filter keys from old format to new format
  const selectedAudience = Object.keys(voterFileFilter)
    .filter(key => voterFileFilter[key] === true && FILTER_KEY_MAPPING[key])
    .map(key => FILTER_KEY_MAPPING[key])

  try {
    await voterFileDownload(outreachType, { filters: selectedAudience })
  } catch (error) {
    errorSnackbar('Error downloading voter file')
  }

  setLoading(false)
}
