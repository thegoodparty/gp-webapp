import Checkbox from '@shared/inputs/Checkbox'
import TextField from '@shared/inputs/TextField'
import Body2 from '@shared/typography/Body2'
import Overline from '@shared/typography/Overline'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

import { useEffect, useState, ChangeEvent } from 'react'

interface FieldOption {
  key: AudienceFilterKey
  label: string
}

interface FieldGroup {
  label: string
  options: FieldOption[]
}

const fields: FieldGroup[] = [
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
      { key: 'age_50_plus', label: '50+' },
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

export type AudienceFilterKey =
  | 'audience_superVoters'
  | 'audience_likelyVoters'
  | 'audience_unreliableVoters'
  | 'audience_unlikelyVoters'
  | 'audience_firstTimeVoters'
  | 'party_independent'
  | 'party_democrat'
  | 'party_republican'
  | 'age_18_25'
  | 'age_25_35'
  | 'age_35_50'
  | 'age_50_plus'
  | 'gender_male'
  | 'gender_female'
  | 'gender_unknown'
  | 'audience_request'

export interface AudienceFiltersState {
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
  audience_request?: string | boolean
}

type PurposeKey = 'GOTV' | 'Persuasion' | 'Voter ID'

type PurposeToFiltersMap = {
  GOTV: AudienceFiltersState
  Persuasion: AudienceFiltersState
  'Voter ID': AudienceFiltersState
}

const purposeToFilters: PurposeToFiltersMap = {
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

const isPurposeKey = (value: string): value is PurposeKey => {
  return value === 'GOTV' || value === 'Persuasion' || value === 'Voter ID'
}

export const TRACKING_KEYS = {
  scheduleCampaign: 'scheduleCampaign',
  customVoterFile: 'customVoterFile',
}

interface TrackingEventMapEntry {
  inputRequest?: string
  checkAudience: string
  checkPoliticalParty: string
  checkAge: string
  checkGender: string
}

type TrackingEventMapType = {
  scheduleCampaign: TrackingEventMapEntry
  customVoterFile: TrackingEventMapEntry
}

const TRACKING_EVENT_MAP: TrackingEventMapType = {
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

interface PrevStepValues {
  purpose?: string
}

interface CustomVoterAudienceFiltersProps {
  audience?: AudienceFiltersState | null
  showAudienceRequest?: boolean
  prevStepValues?: PrevStepValues
  onChangeCallback?: (newState: AudienceFiltersState) => void
  readOnly?: boolean
  trackingKey?: string
}

const CustomVoterAudienceFilters = ({
  audience,
  showAudienceRequest,
  prevStepValues,
  onChangeCallback,
  readOnly = false,
  trackingKey,
}: CustomVoterAudienceFiltersProps): React.JSX.Element => {
  const [state, setState] = useState<AudienceFiltersState>({
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
    if (purpose && isPurposeKey(purpose)) {
      const newState = purposeToFilters[purpose]
      setState(newState)
      onChangeCallback?.(newState)
    }
  }, [purpose])

  const handleChangeAudience = (option: string, val: boolean | string) => {
    if (readOnly) return

    if (trackingKey && (trackingKey === 'scheduleCampaign' || trackingKey === 'customVoterFile')) {
      const trackingEvents = TRACKING_EVENT_MAP[trackingKey]
      if (option.startsWith('audience_')) {
        if (option === 'audience_request') {
          if (trackingEvents.inputRequest) {
            trackEvent(trackingEvents.inputRequest)
          }
        } else {
          trackEvent(trackingEvents.checkAudience, {
            option,
            val,
          })
        }
      } else if (option.startsWith('party_')) {
        trackEvent(trackingEvents.checkPoliticalParty, {
          option,
          val,
        })
      } else if (option.startsWith('age_')) {
        trackEvent(trackingEvents.checkAge, {
          option,
          val,
        })
      } else if (option.startsWith('gender_')) {
        trackEvent(trackingEvents.checkGender, {
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
    onChangeCallback?.(newState)
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleChangeAudience(option.key, e.target.checked)
                }}
                checked={Boolean(state[option.key])}
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
          value={state.audience_request || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
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

export default CustomVoterAudienceFilters
