import { AUDIENCE_LABELS_MAPPING } from 'app/(candidate)/dashboard/outreach/consts'

export const formatAudienceLabels = ({
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
} = {}) => {
  const filtersFields = {
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
  }
  return Object.keys({
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
  })
    .filter((k) => Boolean(filtersFields[k]))
    .map((k) => AUDIENCE_LABELS_MAPPING[k])
}
