'use client'
import { useState } from 'react'
import RenderInputField from '@shared/inputs/RenderInputField'
import { flatStates } from 'helpers/statesHelper'
import Body1 from '@shared/typography/Body1'
import {
  dateFromNonStandardUSFormatString,
  isSameDay,
} from 'helpers/dateHelper'
import Button from '@shared/buttons/Button'

const fields = [
  {
    key: 'office',
    label: 'Office Name',
    type: 'text',
    required: true,
  },
  {
    key: 'state',
    label: 'State',
    type: 'select',
    options: flatStates,
    required: true,
  },

  {
    key: 'city',
    label: 'City, Town or County',
    type: 'text',
  },

  {
    key: 'district',
    label: 'District (if applicable)',
    type: 'text',
  },

  {
    key: 'officeTermLength',
    label: 'Term Length',
    type: 'select',
    required: true,
    options: ['2 years', '3 years', '4 years', '6 years'],
  },
  {
    key: 'electionDate',
    label: 'Election Date',
    type: 'date',
    required: true,
    noPastDates: true,
  },
]

export default function CustomOfficeForm({ campaign, onSave }) {
  const [state, setState] = useState({
    state: campaign.details?.state || '',
    office: campaign.details?.office || '',
    officeTermLength: campaign.details?.officeTermLength || '',
    otherOffice: campaign.details?.otherOffice || '',
    district: campaign.details?.district || '',
    city: campaign.details?.city || '',
    ballotOffice: campaign.details?.ballotOffice || false,
    electionDate: campaign.details?.electionDate || '',
  })
  const now = new Date()
  const selectedDate = dateFromNonStandardUSFormatString(state['electionDate'])
  const error =
    state.electionDate && !isSameDay(selectedDate, now) && selectedDate < now

  const disableSubmit =
    state.state === '' ||
    state.office === '' ||
    state.officeTermLength === '' ||
    state.electionDate === '' ||
    error

  const onChange = (key, value) => {
    setState({
      ...state,
      [key]: value,
    })
  }

  const handleSave = async () => {
    if (disableSubmit) {
      return
    }
    const updated = campaign

    updated.details = {
      ...campaign.details,
      ...state,
      positionId: null,
      electionId: null,
      ballotOffice: null,
      electionDate: state.electionDate,
    }
    onSave(updated)
  }

  return (
    <div>
      <Body1 className="my-8">
        Please Note: Make sure your office was not in the list. Manual entry of
        your office details requires our team&apos;s review, which can delay
        full access to features. Wait times vary based on demand.
      </Body1>
      {fields.map((field) => (
        <RenderInputField
          field={field}
          key={field.key}
          value={state[field.key]}
          onChangeCallback={onChange}
          error={field.noPastDates && error}
        />
      ))}

      <div className="flex justify-center mb-8">
        <Button size="large" onClick={handleSave} disabled={disableSubmit}>
          <div className="font-black">Save</div>
        </Button>
      </div>
    </div>
  )
}
