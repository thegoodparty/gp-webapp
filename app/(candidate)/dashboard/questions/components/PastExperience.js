'use client'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import TextField from '@shared/inputs/TextField'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import H3 from '@shared/typography/H3'
import { useState } from 'react'

const fields = [
  {
    key: 'responsibility',
    label: 'Responsibilities',
    title: 'Past responsibilities related to',
  },
  {
    key: 'achievements',
    label: 'Achievements',
    title: 'Past achievements related to',
  },
  { key: 'skills', label: 'Skills', title: 'Skills related to' },
]

export default function PastExperience({
  value,
  saveCallback,
  campaign,
  campaignKey,
}) {
  const [state, setState] = useState({
    responsibility: value?.responsibility || '',
    achievements: value?.achievements || '',
    skills: value?.skills || '',
  })

  const onChangeField = (key, value) => {
    setState({
      ...state,
      [key]: value,
    })
  }
  const handleSave = () => {
    if (!canSave()) return
    saveCallback([`details.${campaignKey}`], [state])
  }

  const canSave = () => {
    return (
      state.responsibility !== '' &&
      state.achievements !== '' &&
      state.skills !== ''
    )
  }
  const office =
    campaign.details.otherOffice || campaign.office || 'your office'
  return (
    <div className="max-w-xl m-auto">
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <H1 className="mb-10">
          Tell us about your past experiences and why you want to run for office
        </H1>
        <Body1 className="my-8 text-center">
          We&apos;ll take the information you provide and apply best practices
          from GOOD Campaigns to create your policy guide.
        </Body1>
        {fields.map((field) => (
          <div key={field.key}>
            <H3 className="mt-10 mb-6">
              {field.title} {office}
            </H3>
            <TextField
              required
              label={field.label}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={state[field.key]}
              onChange={(e) => {
                onChangeField(field.key, e.target.value)
              }}
            />
          </div>
        ))}

        <div className="flex justify-center mt-10" onClick={handleSave}>
          <PrimaryButton className="mt-3" disabled={!canSave()} type="submit">
            Next
          </PrimaryButton>
        </div>
      </form>
    </div>
  )
}
