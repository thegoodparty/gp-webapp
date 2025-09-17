'use client'
import TextField from '@shared/inputs/TextField'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import { buildTrackingAttrs } from 'helpers/analyticsHelper'
import { useMemo, useState } from 'react'
import Button from '@shared/buttons/Button'
import {
  LEGACY_TASK_TYPES,
  TASK_TYPES,
} from '../../../shared/constants/tasks.const'
import { addDays, format, parseISO, startOfDay } from 'date-fns'

export default function ScheduleStep({
  onChangeCallback,
  nextCallback,
  backCallback,
  onCreateOutreach = async () => {},
  onScheduleOutreach = async (outreach = {}) => {},
  type,
  schedule,
  isLastStep,
}) {
  const [state, setState] = useState(
    schedule || {
      date: '',
      message: '',
    },
  )
  const [dateError, setDateError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const trackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Schedule Contact Campaign Submit Button', { type }),
    [type],
  )

  const onChangeField = (key, value) => {
    const newState = {
      ...state,
      [key]: value,
    }
    setState(newState)
    onChangeCallback('schedule', newState)
  }

  const canSubmit = () => state.date != '' && !dateError

  const handleNext = async () => {
    setIsLoading(true)
    await onScheduleOutreach(await onCreateOutreach())
    setIsLoading(false)
    nextCallback()
  }

  const handleTextFieldOnChange = (e) => {
    const dateString = e.target.value
    const localDate = startOfDay(parseISO(dateString))
    onChangeField('date', localDate)

    const minDateObj = startOfDay(parseISO(minDate))

    if (localDate >= minDateObj) {
      setDateError(null)
    } else {
      setDateError('Date must be at least 72 hours from now')
    }
  }

  // This conversion has to be done to appease MUI's date-type TextField
  const dateTextFieldValue = state?.date
    ? format(state?.date, 'yyyy-MM-dd')
    : ''
  const isTel =
    type === LEGACY_TASK_TYPES.telemarketing || type === TASK_TYPES.robocall
  const today = new Date()
  const minDate = addDays(today, 3).toISOString().split('T')[0]
  return (
    <div className="p-4 w-[80vw] max-w-xl">
      <div className="text-center">
        <H1>Schedule {isTel ? 'robocall' : 'text message'}</H1>
        <Body1 className="mt-4 mb-8">
          Use the from below to schedule your campaign.
          <br />
          <strong>Requires 3 days to process.</strong>
        </Body1>

        <div className="mt-4">
          <TextField
            fullWidth
            label="Send date"
            type="date"
            required
            value={dateTextFieldValue}
            onChange={handleTextFieldOnChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: minDate,
            }}
            error={!!dateError}
            helperText={dateError}
          />
        </div>
        <div className="mt-4">
          <TextField
            label="Scheduling Request"
            placeholder="Do you have any additional requests related to scheduling your campaign?"
            multiline
            rows={5}
            fullWidth
            value={state.message}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              onChangeField('message', e.target.value)
            }}
          />
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-6 text-left mt-6">
            <Button size="large" color="neutral" onClick={backCallback}>
              Back
            </Button>
          </div>
          <div className="col-span-6 text-right mt-6">
            <Button
              loading={isLoading}
              size="large"
              color="secondary"
              onClick={handleNext}
              disabled={!canSubmit() || isLoading}
              {...trackingAttrs}
            >
              {isLastStep ? 'Schedule' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
