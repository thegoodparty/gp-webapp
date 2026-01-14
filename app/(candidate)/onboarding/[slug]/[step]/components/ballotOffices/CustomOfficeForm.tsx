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
import { identifyUser } from '@shared/utils/analytics'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useUser } from '@shared/hooks/useUser'
import { Campaign } from 'helpers/types'

type FormFieldKey = 'office' | 'state' | 'city' | 'district' | 'officeTermLength' | 'electionDate'

interface FormField {
  key: FormFieldKey
  label: string
  type: string
  required?: boolean
  placeholder?: string
  options?: string[]
  noPastDates?: boolean
  dataAttributes?: {
    'data-amplitude-unmask'?: string
  }
}

const fields: FormField[] = [
  {
    key: 'office',
    label: 'Office Name',
    type: 'text',
    required: true,
    placeholder: 'Other',
    dataAttributes: {
      'data-amplitude-unmask': 'true'
    },
  },
  {
    key: 'state',
    label: 'State',
    type: 'select',
    options: [...flatStates],
    required: true,
    dataAttributes: {
      'data-amplitude-unmask': 'true'
    },
  },
  {
    key: 'city',
    label: 'City, Town Or County',
    type: 'text',
    required: true,
    dataAttributes: {
      'data-amplitude-unmask': 'true'
    },
  },
  {
    key: 'district',
    label: 'District (If Applicable)',
    type: 'text',
    placeholder: '2',
    dataAttributes: {
      'data-amplitude-unmask': 'true'
    },
  },
  {
    key: 'officeTermLength',
    label: 'Term Length',
    type: 'select',
    required: true,
    options: ['Select', '2 years', '3 years', '4 years', '6 years'],
    dataAttributes: {
      'data-amplitude-unmask': 'true'
    },
  },
  {
    key: 'electionDate',
    label: 'General Election Date',
    type: 'date',
    required: true,
    noPastDates: true,
    placeholder: '10/28/2025',
    dataAttributes: {
      'data-amplitude-unmask': 'true'
    },
  },
]

interface CustomOfficeFormState {
  state: string
  office: string
  officeTermLength: string
  otherOffice: string
  district: string
  city: string
  electionDate: string
}

interface CustomOfficeFormProps {
  campaign: Campaign
  onSave: (campaign: Campaign) => void
  onBack: () => void
}

export default function CustomOfficeForm({
  campaign,
  onSave,
  onBack,
}: CustomOfficeFormProps): React.JSX.Element {
  const [state, setState] = useState<CustomOfficeFormState>({
    state: campaign.details?.state || '',
    office: campaign.details?.office || '',
    officeTermLength: campaign.details?.officeTermLength || '',
    otherOffice: campaign.details?.otherOffice || '',
    district: campaign.details?.district || '',
    city: campaign.details?.city || '',
    electionDate: campaign.details?.electionDate || '',
  })
  const [user] = useUser()
  const now = new Date()
  const selectedDate = dateFromNonStandardUSFormatString(state['electionDate'])
  const isDateInPast =
    state.electionDate &&
    selectedDate instanceof Date &&
    !isSameDay(selectedDate, now) &&
    selectedDate < now

  const disableSubmit =
    state.state === '' ||
    state.office === '' ||
    state.officeTermLength === '' ||
    state.city === '' ||
    state.electionDate === '' ||
    Boolean(isDateInPast)

  const onChange = (key: string, value: string | boolean) => {
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
      officeState: state.state,
      officeMunicipality: state.city,
      officeName: state.office,
      officeElectionDate: state.electionDate,
    }
    if (user?.id) {
      await identifyUser(user.id, trackingProperties)
    }
    trackEvent(EVENTS.Onboarding.OfficeStep.OfficeCompleted, {
      ...trackingProperties,
      officeManuallyInput: true,
    })
  }

  return (
    <div>
      <div className="text-center mb-8">
        <H1>Request help</H1>
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
            error={field.noPastDates ? Boolean(isDateInPast) : undefined}
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
          disabled={Boolean(disableSubmit)}
          className="bg-slate-800 hover:bg-slate-700"
        >
          Send request
        </Button>
      </div>
    </div>
  )
}
