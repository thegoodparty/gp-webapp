import { scheduleVoterMessagingCampaign } from 'helpers/scheduleVoterMessagingCampaign'
import { createOutreach } from 'helpers/createOutreach'
import { createVoterFileFilter } from 'helpers/createVoterFileFilter'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { createP2pPhoneList, PhoneListInput } from 'helpers/createP2pPhoneList'
import { noop } from '@shared/utils/noop'
import { getEffectiveOutreachType } from 'app/(candidate)/dashboard/outreach/util/getEffectiveOutreachType'
import { VoterFileFilters } from 'helpers/types'
import { Outreach } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'

const PEERLY_DEFAULT_IMAGE_TITLE = `P2P Outreach - Campaign`

// AudienceState uses underscore keys for frontend form state (CustomVoterAudienceFilters)
// This differs from VoterFileFilters which uses camelCase for API persistence
export interface AudienceState {
  audience_request?: string | boolean
  count?: number
  audience_superVoters?: boolean
  audience_likelyVoters?: boolean
  audience_unreliableVoters?: boolean
  audience_unlikelyVoters?: boolean
  audience_firstTimeVoters?: boolean
  party_independent?: boolean
  party_democrat?: boolean
  party_republican?: boolean
  age_18_25?: boolean
  age_25_35?: boolean
  age_35_50?: boolean
  age_50_plus?: boolean
  gender_male?: boolean
  gender_female?: boolean
  gender_unknown?: boolean
}

export interface ScheduleState {
  date?: Date | string
  message?: string
}

export interface FlowState {
  script?: string | false | null
  schedule?: ScheduleState
  image?: File | null
  voterFileFilter?: (PhoneListInput & { id?: string }) | null
  audience?: AudienceState
  phoneListId?: number | null
}

interface ScheduleOutreachParams {
  budget?: number
  audience?: AudienceState
}

interface CreateOutreachParams {
  type?: string
  state: FlowState
  campaignId: number
  outreaches?: Outreach[]
  setOutreaches?: (outreaches: Outreach[]) => void
  errorSnackbar?: (message: string) => void
  refreshCampaign?: () => Promise<void>
  p2pUxEnabled?: boolean
}

interface CreateVoterFileFilterParams {
  type?: string
  state: {
    audience?: AudienceState
    voterCount?: number
  }
  errorSnackbar?: (message: string) => void
}

// MappedAudience is the subset of VoterFileFilters used for audience mapping
type MappedAudience = Pick<VoterFileFilters,
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
  | 'genderUnknown'
>

type MappedAudienceKey = keyof MappedAudience

export const handleScheduleOutreach =
  (
    type = '',
    errorSnackbar: (message: string) => void = () => {},
    successSnackbar: (message: string) => void = () => {},
    { budget, audience }: ScheduleOutreachParams = {},
  ) =>
  async (outreach: Outreach = { id: '' }): Promise<void> => {
    const { audience_request: audienceRequest } = audience || {}
    const result = await scheduleVoterMessagingCampaign(
      outreach.id,
      audienceRequest,
    )
    if (!result) {
      errorSnackbar('There was an error scheduling your campaign')
      return
    }
    trackEvent(EVENTS.Dashboard.VoterContact.CampaignCompleted, {
      medium: type,
      price: budget,
      voterContacts: audience!.count || 0,
    })
    successSnackbar('Request submitted successfully.')
  }

export const handleCreateOutreach =
  ({
    type = '',
    state: { script, schedule, image, voterFileFilter, audience, phoneListId },
    campaignId,
    outreaches = [],
    setOutreaches = () => {},
    errorSnackbar = () => {},
    refreshCampaign = async () => {},
    p2pUxEnabled = true,
  }: CreateOutreachParams) =>
  async (): Promise<Outreach | undefined> => {
    const { audience_request: audienceRequest } = audience || {}
    const { message } = schedule || {}
    const date = schedule?.date
    const outreach = await createOutreach(
      {
        campaignId,
        outreachType: getEffectiveOutreachType(type, p2pUxEnabled),
        message,
        title: `${PEERLY_DEFAULT_IMAGE_TITLE} ${campaignId}`,
        script,
        ...(date ? { date } : {}),
        ...(voterFileFilter ? { voterFileFilterId: voterFileFilter.id } : {}),
        ...(audienceRequest ? { audienceRequest } : {}),
        ...(p2pUxEnabled ? { phoneListId } : {}),
      },
      image || null,
    )

    if (!outreach) {
      errorSnackbar('There was an error creating your outreach campaign')
      return
    }

    setOutreaches([...outreaches, outreach])

    await refreshCampaign()

    return outreach
  }

export const mapAudienceForPersistence = ({
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
}: AudienceState = {}): MappedAudience => {
  // TODO: Fix the keys for the audience values in the CustomVoterAudienceFilters
  //  to match the API once we redo that component so that we don't have to do
  //  this mapping: https://goodparty.atlassian.net/browse/WEB-4277

  const mappedAudience: MappedAudience = {
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
  }

  const AUDIENCE_KEYS: MappedAudienceKey[] = [
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
    'genderUnknown',
  ]

  return AUDIENCE_KEYS.reduce<MappedAudience>(
    (acc, k) => ({
      ...acc,
      ...(Boolean(mappedAudience[k]) ? { [k]: mappedAudience[k] } : {}),
    }),
    {},
  )
}

export const handleCreatePhoneList =
  (errorSnackbar: (message: string) => void = noop) =>
  async (voterFileFilter: PhoneListInput | undefined): Promise<string | undefined> => {
    const result = await createP2pPhoneList(voterFileFilter)
    const phoneListToken = result ? result.token : undefined

    if (!phoneListToken) {
      errorSnackbar(
        'There was an error generating a phone list. Please try again.',
      )
      return
    }
    return phoneListToken
  }

export const handleCreateVoterFileFilter =
  ({ type = '', state: { audience, voterCount }, errorSnackbar = noop }: CreateVoterFileFilterParams) =>
  async (): Promise<PhoneListInput | undefined> => {
    const chosenAudiences = mapAudienceForPersistence(audience)

    const voterFileFilter = await createVoterFileFilter({
      name: `${type} Campaign`,
      ...chosenAudiences,
      voterCount,
    })

    if (!voterFileFilter) {
      errorSnackbar('There was an error creating your voter file filter')
      return
    }

    return voterFileFilter
  }
