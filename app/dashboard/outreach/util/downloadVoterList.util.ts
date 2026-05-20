import { noop } from '@shared/utils/noop'
import { voterFileDownload } from 'helpers/voterFileDownload'
import { VoterFileFilters } from 'helpers/types'
import { AudienceState } from 'app/dashboard/components/tasks/flows/util/flowHandlers.util'
import type { AudienceFilterKey } from 'app/dashboard/voter-records/components/CustomVoterAudienceFilters'

interface DownloadVoterListParams {
  voterFileFilter?: VoterFileFilters | AudienceState
  outreachType?: string
}

export const downloadVoterList = async (
  { voterFileFilter = {}, outreachType = '' }: DownloadVoterListParams = {},
  setLoading: (loading: boolean) => void = noop,
  errorSnackbar: (message: string) => void = noop,
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
    genderUnknown,
  } = resolvedFilter

  // TODO: Fix the keys for the audience values in the CustomVoterAudienceFilters:
  //  https://goodparty.atlassian.net/browse/WEB-4277
  // If making a change, also update:
  // gp-webapp/app/dashboard/outreach/util/downloadVoterList.util.ts
  // gp-webapp/app/dashboard/components/tasks/flows/util/flowHandlers.util.ts
  // gp-webapp/app/dashboard/outreach/util/convertAudienceFiltersForModal.util.ts
  // gp-webapp/app/dashboard/outreach/util/formatAudienceLabels.util.ts
  // gp-webapp/app/dashboard/outreach/constants.tsx
  const audience: Record<
    Exclude<AudienceFilterKey, 'audience_request'>,
    boolean | undefined
  > = {
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
  const selectedAudience = Object.entries(audience)
    .filter(([, value]) => value === true)
    .map(([key]) => key)

  try {
    await voterFileDownload(outreachType, { filters: selectedAudience })
  } catch {
    errorSnackbar('Error downloading voter file')
  }

  setLoading(false)
}
