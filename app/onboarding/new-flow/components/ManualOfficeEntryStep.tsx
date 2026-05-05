'use client'

import RenderInputField, {
  type FieldConfig,
} from '@shared/inputs/RenderInputField'
import { flatStates } from 'helpers/statesHelper'
import {
  dateFromNonStandardUSFormatString,
  isSameDay,
} from 'helpers/dateHelper'
import type { ManualOfficeForm } from './newOnboardingTypes'

interface ManualOfficeEntryStepProps {
  value: ManualOfficeForm | undefined
  onChange: (value: ManualOfficeForm) => void
}

const FIELDS: FieldConfig[] = [
  {
    key: 'office',
    label: 'Office Name',
    type: 'text',
    required: true,
    placeholder: 'Other',
    dataAttributes: { 'data-amplitude-unmask': 'true' },
  },
  {
    key: 'state',
    label: 'State',
    type: 'select',
    options: [...flatStates],
    required: true,
    dataAttributes: { 'data-amplitude-unmask': 'true' },
  },
  {
    key: 'city',
    label: 'City, Town Or County',
    type: 'text',
    required: true,
    dataAttributes: { 'data-amplitude-unmask': 'true' },
  },
  {
    key: 'district',
    label: 'District (If Applicable)',
    type: 'text',
    placeholder: '2',
    dataAttributes: { 'data-amplitude-unmask': 'true' },
  },
  {
    key: 'officeTermLength',
    label: 'Term Length',
    type: 'select',
    required: true,
    options: ['Select', '2 years', '3 years', '4 years', '6 years'],
    dataAttributes: { 'data-amplitude-unmask': 'true' },
  },
  {
    key: 'electionDate',
    label: 'General Election Date',
    type: 'date',
    required: true,
    noPastDates: true,
    placeholder: '10/28/2025',
    dataAttributes: { 'data-amplitude-unmask': 'true' },
  },
]

const EMPTY_FORM: ManualOfficeForm = {
  office: '',
  state: '',
  city: '',
  district: '',
  officeTermLength: '',
  electionDate: '',
}

export const ManualOfficeEntryStep = ({
  value,
  onChange,
}: ManualOfficeEntryStepProps): React.JSX.Element => {
  const form = value ?? EMPTY_FORM
  const selectedDate = dateFromNonStandardUSFormatString(form.electionDate)
  const now = new Date()
  const isDateInPast =
    Boolean(form.electionDate) &&
    selectedDate instanceof Date &&
    !isSameDay(selectedDate, now) &&
    selectedDate < now

  const handleChange = (key: string, next: string | boolean) => {
    onChange({ ...form, [key]: next as string })
  }

  return (
    <div className="space-y-6 text-left">
      {FIELDS.map((field) => (
        <RenderInputField
          field={field}
          key={field.key}
          value={form[field.key as keyof ManualOfficeForm] ?? ''}
          onChangeCallback={handleChange}
          error={field.noPastDates ? Boolean(isDateInPast) : undefined}
        />
      ))}
    </div>
  )
}
