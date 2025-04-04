import Checkbox from '@shared/inputs/Checkbox'
import TextField from '@shared/inputs/TextField'
import Body2 from '@shared/typography/Body2'
import Overline from '@shared/typography/Overline'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'

import { useEffect, useState } from 'react'

const fields = [
  {
    label: 'AUDIENCE',
    options: [
      { key: 'audience_superVoters', label: 'Super Voters (75% +)' },
      { key: 'audience_likelyVoters', label: 'Likely Voters (50%-75%)' },
      {
        key: 'audience_unreliableVoters',
        label: 'Unreliable Voters (25%-50%)',
      },
      { key: 'audience_unlikelyVoters', label: 'Unlikely Voters (0%-25%)' },
      { key: 'audience_firstTimeVoters', label: 'First Time Voters' },
    ],
  },
  {
    label: 'POLITICAL PARTY',
    options: [
      { key: 'party_independent', label: 'Independent / Non-Partisan' },
      { key: 'party_democrat', label: 'Democrat' },
      { key: 'party_republican', label: 'Republican' },
    ],
  },
  {
    label: 'AGE',
    options: [
      { key: 'age_18_25', label: '18-25' },
      { key: 'age_25_35', label: '25-35' },
      { key: 'age_35_50', label: '35-50' },
      { key: 'age_50+', label: '50+' },
    ],
  },
  {
    label: 'GENDER',
    options: [
      { key: 'gender_male', label: 'Male' },
      { key: 'gender_female', label: 'Female' },
      { key: 'gender_unknown', label: 'Unknown' },
    ],
  },
]

/*
 if prevStepValues.purpose is selected preSelect these filters
 GOTV = 25% - 75%, + First Time Voters, Independent, Default All Ages + Genders
Persuasion = 50% - 100%, + First Time Voters, Independent, Default All Ages + Genders
Voter ID = 0 - 100%, Independent, Default All Ages + Genders
*/
const purposeToFilters = {
  GOTV: {
    audience_likelyVoters: true,
    audience_unreliableVoters: true,
    audience_firstTimeVoters: true,
    party_independent: true,
    age_18_25: true,
    age_25_35: true,
    age_35_50: true,
    audience_request: '',
  },
  Persuasion: {
    audience_likelyVoters: true,
    audience_superVoters: true,
    audience_firstTimeVoters: true,
    party_independent: true,
    age_18_25: true,
    age_25_35: true,
    age_35_50: true,
    audience_request: '',
  },
  'Voter ID': {
    audience_superVoters: true,
    audience_likelyVoters: true,
    audience_unreliableVoters: true,
    audience_unlikelyVoters: true,
    audience_firstTimeVoters: true,
    party_independent: true,
    age_18_25: true,
    age_25_35: true,
    age_35_50: true,
    audience_request: '',
  },
}

export const TRACKING_KEYS = {
  scheduleCampaign: 'scheduleCampaign',
  customVoterFile: 'customVoterFile',
}

const TRACKING_EVENT_MAP = {
  scheduleCampaign: {
    inputRequest:
      EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Audience
        .EnterRequest,
    checkAudience:
      EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Audience
        .CheckAudience,
    checkPoliticalParty:
      EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Audience
        .CheckPoliticalParty,
    checkAge:
      EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Audience.CheckAge,
    checkGender:
      EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Audience
        .CheckGender,
  },
  customVoterFile: {
    checkAudience: EVENTS.VoterData.CustomFile.Audience.CheckAudience,
    checkPoliticalParty:
      EVENTS.VoterData.CustomFile.Audience.CheckPoliticalParty,
    checkAge: EVENTS.VoterData.CustomFile.Audience.CheckAge,
    checkGender: EVENTS.VoterData.CustomFile.Audience.CheckGender,
  },
}

export default function CustomVoterAudienceFilters({
  audience,
  showAudienceRequest,
  prevStepValues,
  onChangeCallback,
  readOnly = false,
  trackingKey,
}) {
  // set initial state to all false
  const [state, setState] = useState({
    audience_superVoters: false,
    audience_likelyVoters: false,
    audience_unreliableVoters: false,
    audience_unlikelyVoters: false,
    audience_firstTimeVoters: false,
    party_independent: false,
    party_democrat: false,
    party_republican: false,
    age_18_25: false,
    age_25_35: false,
    age_35_50: false,
    audience_request: '',
    ...audience,
  })

  const { purpose } = prevStepValues || {}

  useEffect(() => {
    if (purpose) {
      const newState = purposeToFilters[purpose]
      setState(newState)
      onChangeCallback(newState)
    }
  }, [purpose])

  const handleChangeAudience = (option, val) => {
    if (readOnly) return

    if (trackingKey && TRACKING_EVENT_MAP[trackingKey]) {
      // tracking
      if (option.startsWith('audience_')) {
        if (option === 'audience_request') {
          trackEvent(TRACKING_EVENT_MAP[trackingKey].inputRequest)
        } else {
          trackEvent(TRACKING_EVENT_MAP[trackingKey].checkAudience, {
            option,
            val,
          })
        }
      } else if (option.startsWith('party_')) {
        trackEvent(TRACKING_EVENT_MAP[trackingKey].checkPoliticalParty, {
          option,
          val,
        })
      } else if (option.startsWith('age_')) {
        trackEvent(TRACKING_EVENT_MAP[trackingKey].checkAge, {
          option,
          val,
        })
      } else if (option.startsWith('gender_')) {
        trackEvent(TRACKING_EVENT_MAP[trackingKey].checkGender, {
          option,
          val,
        })
      }
    }

    const newState = {
      ...state,
      [option]: val,
    }
    setState(newState)
    onChangeCallback(newState)
  }

  return (
    <div className="mt-8 grid grid-cols-12 gap-4">
      {fields.map((field) => (
        <div
          className="col-span-12 md:col-span-6 lg:col-span-3 mt-2"
          key={field.label}
        >
          <Overline>{field.label}</Overline>
          {field.options.map((option) => (
            <div key={option.key} className="flex items-center mt-3">
              <Checkbox
                label={<Body2>{option.label}</Body2>}
                onChange={(e) => {
                  handleChangeAudience(option.key, e.target.checked)
                }}
                checked={state[option.key] ?? false}
                color="secondary"
                disabled={readOnly}
              />
            </div>
          ))}
        </div>
      ))}
      {showAudienceRequest && (
        <TextField
          className="col-span-12 mt-2 rounded-lg"
          label="Audience Request"
          placeholder="Is there a specific area in your district you are trying to target? Are you interested in reaching out to veterans in your community? Let us know here. "
          value={state.audience_request}
          onChange={(e) =>
            handleChangeAudience('audience_request', e.target.value)
          }
          InputLabelProps={{ shrink: true, className: 'font-sfpro text-black' }}
          multiline
          rows={3}
        ></TextField>
      )}
    </div>
  )
}
