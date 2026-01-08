'use client'

import H3 from '@shared/typography/H3'
import Body1 from '@shared/typography/Body1'
import RenderInputField from '@shared/inputs/RenderInputField'
import { useEffect, useState } from 'react'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { CircularProgress } from '@mui/material'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { Campaign } from 'helpers/types'

interface Field {
  key: 'pastExperience'
  label: string
  placeholder: string
  required: boolean
  type: string
  rows: number
}

const fields: Field[] = [
  {
    key: 'pastExperience',
    label: '',
    placeholder:
      'EXAMPLE: I have 5 years of experience on the local school board, where I worked to improve the quality of education by developing policies, securing funding, and establishing partnerships. This led to higher student achievement, increased graduation rates, and better school facilities. This experience has equipped me with the skills and commitment needed to serve as an elected official.',
    required: true,
    type: 'text',
    rows: 10,
  },
]

interface WhySectionProps {
  campaign?: Campaign
}

interface FormState {
  pastExperience: string
}

const WhySection = (props: WhySectionProps): React.JSX.Element => {
  const initialState: FormState = { pastExperience: '' }
  const [state, setState] = useState<FormState>(initialState)
  const [saving, setSaving] = useState(false)
  const { campaign } = props
  useEffect(() => {
    if (campaign?.details) {
      const newState: FormState = { pastExperience: '' }
      if (typeof campaign.details.pastExperience === 'string') {
        newState.pastExperience = campaign.details.pastExperience || ''
      } else if (typeof campaign.details.pastExperience === 'object') {
        const pe = campaign.details.pastExperience
        newState.pastExperience = `Achievements: ${
          pe.achievements || ''
        }\nResponsibilities: ${
          pe.responsibility || ''
        }\nSkills: ${pe.skills || ''}`
      } else {
        newState.pastExperience = ''
      }

      setState(newState)
    }
  }, [campaign])
  const canSave = () => {
    let able = true
    fields.forEach((field) => {
      if (field.required && state[field.key] === '') {
        able = false
      }
    })
    return able
  }

  const handleSave = async () => {
    if (canSave()) {
      setSaving(true)

      trackEvent(EVENTS.Profile.Why.ClickSave)

      await updateCampaign([
        {
          key: 'details.pastExperience',
          value: state.pastExperience,
        },
      ])
      setSaving(false)
    }
  }

  const onChangeField = (key: string, val: string | boolean) => {
    setState({
      ...state,
      [key]: String(val),
    })
  }

  return (
    <section className="border-t pt-6 border-gray-600">
      <H3>Your Past Experience</H3>
      <Body1 className="text-gray-600 mt-2  pb-6 mb-12">
        Tell potential voters about your prior experience. Any work or
        experiences that are relevant to the role you plan to run for will
        increase your odds of gaining their support.
      </Body1>
      {fields.map((field) => (
        <div key={field.key}>
          <div className="">
            <RenderInputField
              field={field}
              value={state[field.key]}
              onChangeCallback={onChangeField}
            />
          </div>
        </div>
      ))}
      <div className="flex justify-end mb-6">
        {saving ? (
          <PrimaryButton disabled>
            <div className="px-3">
              <CircularProgress size={16} />
            </div>
          </PrimaryButton>
        ) : (
          <div onClick={handleSave}>
            <PrimaryButton disabled={!canSave()}>Save</PrimaryButton>
          </div>
        )}
      </div>
    </section>
  )
}

export default WhySection
