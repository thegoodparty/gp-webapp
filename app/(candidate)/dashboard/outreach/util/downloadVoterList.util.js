import { voterFileDownload } from 'helpers/voterFileDownload'

export const downloadVoterList = async (
  { voterFileFilter = {}, outreachType = '' } = {},
  setLoading = () => {},
  errorSnackbar = () => {},
) => {
  setLoading(true)

  const {
    audienceSuperVoters,
    audienceLikelyVoters,
    audienceUnreliableVoters,
    audienceUnlikelyVoters,
    audienceFirstTimeVoters,
    partyIndependent,
    partyDemocrat,
    partyRepublican,
    age18_25,
    age25_35,
    age35_50,
    age50Plus,
    genderMale,
    genderFemale,
  } = voterFileFilter

  // TODO: Fix the keys for the audience values in the CustomVoterAudienceFilters:
  //  https://goodparty.atlassian.net/browse/WEB-4277
  const audience = {
    audience_superVoters: audienceSuperVoters,
    audience_likelyVoters: audienceLikelyVoters,
    audience_unreliableVoters: audienceUnreliableVoters,
    audience_unlikelyVoters: audienceUnlikelyVoters,
    audience_firstTimeVoters: audienceFirstTimeVoters,
    party_independent: partyIndependent,
    party_democrat: partyDemocrat,
    party_republican: partyRepublican,
    age_18_25: age18_25,
    age_25_35: age25_35,
    age_35_50: age35_50,
    age_50_plus: age50Plus,
    gender_male: genderMale,
    gender_female: genderFemale,
  }
  const selectedAudience = Object.keys(audience).filter(
    (key) => audience[key] === true,
  )

  try {
    await voterFileDownload(outreachType, { filters: selectedAudience })
  } catch (error) {
    errorSnackbar('Error downloading voter file')
  }

  setLoading(false)
}
