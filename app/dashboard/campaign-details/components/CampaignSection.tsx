'use client'

import H3 from '@shared/typography/H3'
import RenderInputField from '@shared/inputs/RenderInputField'
import { useEffect, useState } from 'react'
import { Button } from '@styleguide'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'
import { LoaderCircleIcon } from '@styleguide'
import { isValidUrl } from 'helpers/linkhelper'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { Campaign } from 'helpers/types'

type CampaignDetailKey =
  | 'campaignCommittee'
  | 'occupation'
  | 'party'
  | 'website'

interface FieldConfig {
  key: CampaignDetailKey
  label: string
  placeholder?: string
  type: 'text' | 'select'
  required?: boolean
  options?: string[]
  invalidOptions?: string[]
  validateFn?: (value: string) => boolean
  helperText?: string
}

interface CampaignSectionProps {
  campaign?: Campaign
  // When rendered inside a Card (pro path), the card supplies the surrounding
  // spacing, so the section drops its own bottom margin.
  carded?: boolean
}

interface FieldState {
  campaignCommittee: string
  occupation: string
  party: string
  website: string
}

const fields: FieldConfig[] = [
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

export default function CampaignSection(
  props: CampaignSectionProps,
): React.JSX.Element {
  const initialState: FieldState = {
    campaignCommittee: '',
    occupation: '',
    party: '',
    website: '',
  }
  const [state, setState] = useState<FieldState>(initialState)
  const [saving, setSaving] = useState(false)
  const { campaign, carded = false } = props

  useEffect(() => {
    if (campaign?.details) {
      setState({
        campaignCommittee: campaign.details.campaignCommittee || '',
        occupation: campaign.details.occupation || '',
        party: campaign.details.party || '',
        website: campaign.details.website || '',
      })
    }
  }, [campaign])

  const canSave = (): boolean => {
    let able = true
    fields.forEach((field) => {
      const value = state[field.key]

      if (field.required && value === '') {
        able = false
      }

      if (
        field.validateFn &&
        value != '' &&
        typeof value === 'string' &&
        !field.validateFn(value)
      ) {
        able = false
      }
    })
    return able
  }

  const handleSave = async (): Promise<void> => {
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

  const isFieldStateKey = (key: string): key is CampaignDetailKey => {
    return (
      key === 'campaignCommittee' ||
      key === 'occupation' ||
      key === 'party' ||
      key === 'website'
    )
  }

  const onChangeField = (key: string, val: string | boolean): void => {
    if (isFieldStateKey(key) && typeof val === 'string') {
      setState({
        ...state,
        [key]: val,
      })
    }
  }

  return (
    <section>
      <H3 className="pb-6">Campaign Details</H3>
      <div className="grid grid-cols-12 gap-3">
        {fields.map((field) => {
          const value = state[field.key] ?? ''
          return (
            <div key={field.key} className="col-span-12 md:col-span-6">
              <div className="pt-5">
                <RenderInputField
                  field={field}
                  value={value}
                  onChangeCallback={onChangeField}
                  error={
                    field.validateFn &&
                    value != '' &&
                    typeof value === 'string' &&
                    !field.validateFn(value)
                  }
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className={`flex justify-end ${carded ? '' : 'mb-6'}`}>
        {saving ? (
          <Button disabled>
            <div className="px-3">
              <LoaderCircleIcon size={16} className="animate-spin" />
            </div>
          </Button>
        ) : (
          <div onClick={handleSave}>
            <Button disabled={!canSave()}>Save</Button>
          </div>
        )}
      </div>
    </section>
  )
}
