import { scheduleVoterMessagingCampaign } from 'helpers/scheduleVoterMessagingCampaign'
import { createOutreach } from 'helpers/createOutreach'
import { createVoterFileFilter } from 'helpers/createVoterFileFilter'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { createP2pPhoneList } from 'helpers/createP2pPhoneList'
import { noop } from '@shared/utils/noop'
import { OUTREACH_TYPES } from 'app/(candidate)/dashboard/outreach/constants'

const PEERLY_DEFAULT_IMAGE_TITLE = `P2P Outreach - Campaign`

interface Outreach {
  id: string
  [key: string]: unknown
}

interface AudienceState {
  audience_request?: string
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

interface ScheduleState {
  date?: Date | string
  message?: string
}

interface VoterFileFilter {
  id: string
  name?: string
  [key: string]: unknown
}

interface FlowState {
  script?: string
  schedule?: ScheduleState
  image?: File | null
  voterFileFilter?: VoterFileFilter
  audience?: AudienceState
  phoneListId?: string
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

interface MappedAudience {
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
  genderUnknown?: boolean
  [key: string]: boolean | undefined
}

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
        outreachType:
          p2pUxEnabled && type === OUTREACH_TYPES.text
            ? OUTREACH_TYPES.p2p
            : type,
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

  return Object.keys(mappedAudience).reduce<MappedAudience>(
    (acc, k) => ({
      ...acc,
      ...(Boolean(mappedAudience[k]) ? { [k]: mappedAudience[k] } : {}),
    }),
    {},
  )
}

export const handleCreatePhoneList =
  (errorSnackbar: (message: string) => void = noop) =>
  async (voterFileFilter: VoterFileFilter | undefined): Promise<string | undefined> => {
    const result = await createP2pPhoneList(voterFileFilter)
    const phoneListToken = result ? result.phoneListToken : undefined

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
  async (): Promise<VoterFileFilter | undefined> => {
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
