'use client'

import H3 from '@shared/typography/H3'
import RenderInputField from '@shared/inputs/RenderInputField'
import { useEffect, useState } from 'react'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { CircularProgress } from '@mui/material'
import { isValidUrl } from 'helpers/linkhelper'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

const fields = [
  {
    key: 'campaignCommittee',
    label: 'Name of Campaign Committee',
    placeholder: 'Campaign Committee',
    type: 'text',
  },
  {
    key: 'occupation',
    label: 'Occupation',
    required: true,
    type: 'text',
  },

  {
    key: 'party',
    label: 'Political Party Affiliation (select one)',
    required: true,
    type: 'select',
    options: [
      'Independent',
      'Green Party',
      'Libertarian Party',
      'Forward Party',
      'Other',
    ],
    invalidOptions: ['Democratic Party', 'Republican Party'],
  },

  {
    key: 'website',
    label: 'Campaign website',
    type: 'text',
    validateFn: isValidUrl,
    helperText: 'Please provide the full url starting with http:// or https://',
  },
]

export default function CampaignSection(props) {
  const initialState = {}
  fields.forEach((field) => {
    initialState[field.key] = ''
  })
  const [state, setState] = useState(initialState)
  const [saving, setSaving] = useState(false)
  const { campaign } = props

  useEffect(() => {
    if (campaign?.details) {
      const newState = {}
      fields.forEach((field) => {
        newState[field.key] = campaign.details[field.key] || ''
      })
      setState(newState)
    }
  }, [campaign])

  const canSave = () => {
    let able = true
    fields.forEach((field) => {
      const value = state[field.key]

      if (field.required && value === '') {
        able = false
      }

      if (field.validateFn && value != '' && !field.validateFn(value)) {
        able = false
      }
    })
    return able
  }

  const handleSave = async () => {
    if (canSave()) {
      trackEvent(EVENTS.Profile.CampaignDetails.ClickSave)
      setSaving(true)
      const attr = fields.map((field) => {
        return { key: `details.${field.key}`, value: state[field.key] }
      })
      await updateCampaign(attr)

      setSaving(false)
    }
  }

  const onChangeField = (key, val) => {
    setState({
      ...state,
      [key]: val,
    })
  }

  return (
    <section>
      <H3 className="pb-6">Campaign Details</H3>
      <div className="grid grid-cols-12 gap-3">
        {fields.map((field) => {
          const value = state[field.key]
          return (
            <div key={field.key} className="col-span-12 md:col-span-6">
              <div className={`${field.type === 'select' ? '' : 'pt-5'}`}>
                <RenderInputField
                  field={field}
                  value={value}
                  onChangeCallback={onChangeField}
                  error={
                    field.validateFn && value != '' && !field.validateFn(value)
                  }
                />
              </div>
            </div>
          )
        })}
      </div>
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
