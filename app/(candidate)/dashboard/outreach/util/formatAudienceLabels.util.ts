import { AUDIENCE_LABELS_MAPPING } from 'app/(candidate)/dashboard/outreach/constants'

// Flexible object type per project guidelines (no any/unknown)
type FlexibleObject = {
  [key: string]: string | number | boolean | object | null | undefined
}

export type AudienceFilterKey =
  | 'audienceSuperVoters'
  | 'audienceLikelyVoters'
  | 'audienceUnreliableVoters'
  | 'audienceUnlikelyVoters'
  | 'audienceFirstTimeVoters'
  | 'partyIndependent'
  | 'partyDemocrat'
  | 'partyRepublican'
  | 'age18_25'
  | 'age25_35'
  | 'age35_50'
  | 'age50Plus'
  | 'genderMale'
  | 'genderFemale'

export type AudienceFilterFlags = Partial<Record<AudienceFilterKey, boolean>> &
  FlexibleObject

export const formatAudienceLabels = (
  filters: AudienceFilterFlags = {} as AudienceFilterFlags,
): string[] => {
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
  } = filters

  const filtersFields: AudienceFilterFlags = {
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

  return Object.keys(filtersFields)
    .filter((k) => Boolean(filtersFields[k as AudienceFilterKey]))
    .map((k) => (AUDIENCE_LABELS_MAPPING as Record<string, string>)[k] || k)
}

export default formatAudienceLabels
