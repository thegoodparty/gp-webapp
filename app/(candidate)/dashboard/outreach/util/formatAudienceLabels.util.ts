import { AUDIENCE_LABELS_MAPPING } from 'app/(candidate)/dashboard/outreach/constants'

interface AudienceFilters {
  audienceSuperVoters?: boolean
  audienceLikelyVoters?: boolean
  audienceUnreliableVoters?: boolean
  audienceUnlikelyVoters?: boolean
  audienceFirstTimeVoters?: boolean
  partyIndependent?: boolean
  partyDemocrat?: boolean
  partyRepublican?: boolean
  age18_25?: boolean
  age25_35?: boolean
  age35_50?: boolean
  age50Plus?: boolean
  genderMale?: boolean
  genderFemale?: boolean
}

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
}: AudienceFilters = {}): string[] => {
  const filtersFields: Record<string, boolean | undefined> = {
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
    .map((k) => (AUDIENCE_LABELS_MAPPING as Record<string, string>)[k])
    .filter((label): label is string => Boolean(label))
}
