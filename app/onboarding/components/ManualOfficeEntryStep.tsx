'use client'

import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@styleguide'
import { useId } from 'react'
import { flatStates } from 'helpers/statesHelper'
import {
  dateFromNonStandardUSFormatString,
  isSameDay,
} from 'helpers/dateHelper'
import type { ManualOfficeForm } from './onboardingTypes'

interface ManualOfficeEntryStepProps {
  value: ManualOfficeForm | undefined
  onChange: (value: ManualOfficeForm) => void
}

const TERM_OPTIONS = ['2 years', '3 years', '4 years', '6 years']

const EMPTY_FORM: ManualOfficeForm = {
  office: '',
  state: '',
  city: '',
  district: '',
  officeTermLength: '',
  electionDate: '',
}

const TODAY_ISO = new Date().toISOString().split('T')[0] as string

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

  const update = (key: keyof ManualOfficeForm) => (val: string) =>
    onChange({ ...form, [key]: val })

  const officeId = useId()
  const stateId = useId()
  const cityId = useId()
  const districtId = useId()
  const termId = useId()
  const electionDateId = useId()

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={officeId}>Office Name </Label>
        <Input
          id={officeId}
          value={form.office}
          onChange={(e) => update('office')(e.target.value)}
          data-amplitude-unmask="true"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={stateId}>State </Label>
        <Select value={form.state} onValueChange={update('state')}>
          <SelectTrigger
            id={stateId}
            className="w-full"
            data-amplitude-unmask="true"
          >
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {flatStates.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={cityId}>City, Town Or County </Label>
        <Input
          id={cityId}
          value={form.city}
          onChange={(e) => update('city')(e.target.value)}
          data-amplitude-unmask="true"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={districtId}>District (If Applicable)</Label>
        <Input
          id={districtId}
          value={form.district}
          onChange={(e) => update('district')(e.target.value)}
          data-amplitude-unmask="true"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={termId}>Term Length </Label>
        <Select
          value={form.officeTermLength}
          onValueChange={update('officeTermLength')}
        >
          <SelectTrigger
            id={termId}
            className="w-full"
            data-amplitude-unmask="true"
          >
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {TERM_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={electionDateId}>General Election Date </Label>
        <Input
          id={electionDateId}
          type="date"
          min={TODAY_ISO}
          value={form.electionDate}
          onChange={(e) => update('electionDate')(e.target.value)}
          aria-invalid={isDateInPast || undefined}
          data-amplitude-unmask="true"
        />
        {isDateInPast && (
          <p className="text-sm text-destructive">
            Election date cannot be in the past.
          </p>
        )}
      </div>
    </div>
  )
}
