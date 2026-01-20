import { AUDIENCE_LABELS_MAPPING, AudienceLabelKey } from 'app/(candidate)/dashboard/outreach/constants'
import { VoterFileFilters } from 'helpers/types'

const AUDIENCE_KEYS: AudienceLabelKey[] = [
  'audienceSuperVoters',
  'audienceLikelyVoters',
  'audienceUnreliableVoters',
  'audienceUnlikelyVoters',
  'audienceFirstTimeVoters',
  'partyIndependent',
  'partyDemocrat',
  'partyRepublican',
  'age18_25',
  'age25_35',
  'age35_50',
  'age50Plus',
  'genderMale',
  'genderFemale',
]

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
}: VoterFileFilters = {}): string[] => {
  const filtersFields: VoterFileFilters = {
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
  return AUDIENCE_KEYS
    .filter((k) => Boolean(filtersFields[k]))
    .map((k) => AUDIENCE_LABELS_MAPPING[k])
    .filter((label): label is string => Boolean(label))
}
