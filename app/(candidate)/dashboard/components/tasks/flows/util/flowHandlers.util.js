import { scheduleVoterMessagingCampaign } from 'helpers/scheduleVoterMessagingCampaign'
import { createOutreach } from 'helpers/createOutreach'
import { createVoterFileFilter } from 'helpers/createVoterFileFilter'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { createP2pPhoneList } from 'helpers/createP2pPhoneList'
import { noop } from '@shared/utils/noop'
import { OUTREACH_TYPES } from 'app/(candidate)/dashboard/outreach/constants'

const PEERLY_DEFAULT_IMAGE_TITLE = `P2P Outreach - Campaign`

export const handleScheduleOutreach =
  (
    type = '',
    errorSnackbar = () => {},
    successSnackbar = () => {},
    { budget, audience } = {},
  ) =>
  async (outreach = {}) => {
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
      voterContacts: audience.count || 0,
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
    refreshCampaign = () => {},
    p2pUxEnabled = true,
  }) =>
  async () => {
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
      image,
    )

    if (!outreach) {
      errorSnackbar('There was an error creating your outreach campaign')
      return
    }

    setOutreaches([...outreaches, outreach])
    
    // Refresh campaign data to update hasFreeTextsOffer after redemption
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
} = {}) => {
  // TODO: Fix the keys for the audience values in the CustomVoterAudienceFilters
  //  to match the API once we redo that component so that we don't have to do
  //  this mapping: https://goodparty.atlassian.net/browse/WEB-4277

  const mappedAudience = {
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

  return Object.keys(mappedAudience).reduce(
    (acc, k) => ({
      ...acc,
      ...(Boolean(mappedAudience[k]) ? { [k]: mappedAudience[k] } : {}),
    }),
    {},
  )
}

export const handleCreatePhoneList =
  (errorSnackbar = noop) =>
  async (voterFileFilter) => {
    const { token: phoneListToken } =
      (await createP2pPhoneList(voterFileFilter)) || {}

    if (!phoneListToken) {
      errorSnackbar(
        'There was an error generating a phone list. Please try again.',
      )
      return
    }
    return phoneListToken
  }

export const handleCreateVoterFileFilter =
  ({ type = '', state: { audience, voterCount }, errorSnackbar = noop }) =>
  async () => {
    const chosenAudiences = mapAudienceForPersistence(audience)

    const voterFileFilter = await createVoterFileFilter({
      name: `${type} Campaign ${Object.keys(chosenAudiences).join(', ')}`,
      ...chosenAudiences,
      voterCount,
    })

    if (!voterFileFilter) {
      errorSnackbar('There was an error creating your voter file filter')
      return
    }

    return voterFileFilter
  }
