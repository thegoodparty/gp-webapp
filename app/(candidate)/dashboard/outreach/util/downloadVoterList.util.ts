import { voterFileDownload } from 'helpers/voterFileDownload'
import { VoterFileFilters } from 'helpers/types'
import { AudienceState } from 'app/(candidate)/dashboard/components/tasks/flows/util/flowHandlers.util'

interface DownloadVoterListParams {
  voterFileFilter?: VoterFileFilters | AudienceState
  outreachType?: string
}

export const downloadVoterList = async (
  { voterFileFilter = {}, outreachType = '' }: DownloadVoterListParams = {},
  setLoading: (loading: boolean) => void = () => {},
  errorSnackbar: (message: string) => void = () => {},
): Promise<void> => {
  setLoading(true)
  const resolvedFilter: VoterFileFilters =
    voterFileFilter && 'audienceSuperVoters' in voterFileFilter
      ? voterFileFilter
      : {}
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
  } = resolvedFilter

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
