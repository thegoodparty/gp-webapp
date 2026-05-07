import { noop } from '@shared/utils/noop'
import { voterFileDownload } from 'helpers/voterFileDownload'
import { VoterFileFilters } from 'helpers/types'
import { AudienceState } from 'app/dashboard/components/tasks/flows/util/flowHandlers.util'

// Keys used in AudienceState format (underscore-delimited)
const AUDIENCE_STATE_FILTER_KEYS = [
  'audience_superVoters',
  'audience_likelyVoters',
  'audience_unreliableVoters',
  'audience_unlikelyVoters',
  'audience_firstTimeVoters',
  'party_independent',
  'party_democrat',
  'party_republican',
  'age_18_25',
  'age_25_35',
  'age_35_50',
  'age_50_plus',
  'gender_male',
  'gender_female',
  'gender_unknown',
] as const

interface DownloadVoterListParams {
  voterFileFilter?: VoterFileFilters | AudienceState
  outreachType?: string
}

const isAudienceState = (
  filter: VoterFileFilters | AudienceState,
): filter is AudienceState => {
  // AudienceState uses underscore keys like 'audience_superVoters'
  // VoterFileFilters uses camelCase keys like 'audienceSuperVoters'
  return 'audience_superVoters' in filter || 'party_independent' in filter
}

const getSelectedFiltersFromAudienceState = (
  audienceState: AudienceState,
): string[] => {
  return AUDIENCE_STATE_FILTER_KEYS.filter(
    (key) => audienceState[key as keyof AudienceState] === true,
  )
}

const getSelectedFiltersFromVoterFileFilters = (
  voterFileFilters: VoterFileFilters,
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
    genderUnknown,
  } = voterFileFilters

  // TODO: Fix the keys for the audience values in the CustomVoterAudienceFilters:
  //  https://goodparty.atlassian.net/browse/WEB-4277
  const audience: Record<string, boolean | undefined> = {
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
    gender_unknown: genderUnknown,
  }

  return Object.keys(audience).filter((key) => audience[key] === true)
}

export const downloadVoterList = async (
  { voterFileFilter = {}, outreachType = '' }: DownloadVoterListParams = {},
  setLoading: (loading: boolean) => void = noop,
  errorSnackbar: (message: string) => void = noop,
): Promise<void> => {
  setLoading(true)

  let selectedAudience: string[] = []

  if (voterFileFilter && Object.keys(voterFileFilter).length > 0) {
    if (isAudienceState(voterFileFilter)) {
      // Handle AudienceState format (from DownloadStep/task flows)
      selectedAudience = getSelectedFiltersFromAudienceState(voterFileFilter)
    } else {
      // Handle VoterFileFilters format (camelCase keys)
      selectedAudience = getSelectedFiltersFromVoterFileFilters(voterFileFilter)
    }
  }

  try {
    await voterFileDownload(outreachType, { filters: selectedAudience })
  } catch {
    errorSnackbar('Error downloading voter file')
  }

  setLoading(false)
}
