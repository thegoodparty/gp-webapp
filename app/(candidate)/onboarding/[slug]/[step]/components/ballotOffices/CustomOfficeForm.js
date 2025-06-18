'use client'
import { useState } from 'react'
import RenderInputField from '@shared/inputs/RenderInputField'
import { flatStates } from 'helpers/statesHelper'
import {
  dateFromNonStandardUSFormatString,
  isSameDay,
} from 'helpers/dateHelper'
import Button from '@shared/buttons/Button'
import H1 from '@shared/typography/H1'
import Body2 from '@shared/typography/Body2'
import { useAnalytics } from '@shared/hooks/useAnalytics'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useUser } from '@shared/hooks/useUser'

const fields = [
  {
    key: 'office',
    label: 'Office Name',
    type: 'text',
    required: true,
    placeholder: 'Other',
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
    label: 'City, Town Or County',
    type: 'text',
    required: true,
  },
  {
    key: 'district',
    label: 'District (If Applicable)',
    type: 'text',
    placeholder: '2',
  },
  {
    key: 'officeTermLength',
    label: 'Term Length',
    type: 'select',
    required: true,
    options: ['Select', '2 years', '3 years', '4 years', '6 years'],
  },
  {
    key: 'electionDate',
    label: 'General Election Date',
    type: 'date',
    required: true,
    noPastDates: true,
    placeholder: '10/28/2025',
  },
]

export default function CustomOfficeForm({ campaign, onSave, onBack }) {
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
  const user = useUser()
  const analytics = useAnalytics()
  const now = new Date()
  const selectedDate = dateFromNonStandardUSFormatString(state['electionDate'])
  const error =
    state.electionDate && !isSameDay(selectedDate, now) && selectedDate < now

  const disableSubmit =
    state.state === '' ||
    state.office === '' ||
    state.officeTermLength === '' ||
    state.city === '' ||
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

    const trackingProperties = {
      state: state.state,
      officeMunicipality: state.city,
      officeName: state.office,
      officeElectionDate: state.electionDate,
    }
    analytics.identify(user.id, trackingProperties)
    trackEvent(EVENTS.Onboarding.OfficeStep.OfficeCompleted, { 
      ...trackingProperties, 
      officeManuallyInput: true, 
    })
  }

  return (
    <div>
      <div className="text-center mb-8">
        <H1 as="h2">Request help</H1>
      </div>
      <Body2 className="mb-12 text-center">
        We are sorry you can&apos;t find your office. This requires manual help
        by our team. This process may take up to 3 days, during which your
        account access will be limited. You will be notified via email once the
        process is finished.
      </Body2>
      <div className="space-y-6">
        {fields.map((field) => (
          <RenderInputField
            field={field}
            key={field.key}
            value={state[field.key]}
            onChangeCallback={onChange}
            error={field.noPastDates && error}
          />
        ))}
      </div>

      <div className="flex justify-between mt-12">
        <Button
          color="neutral"
          size="medium"
          variant="contained"
          onClick={onBack}
        >
          Back to search
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={disableSubmit}
          className="bg-slate-800 hover:bg-slate-700"
        >
          Send request
        </Button>
      </div>
    </div>
  )
}
