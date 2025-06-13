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
import { addDays } from 'date-fns'

export default function ScheduleStep({
  onChangeCallback,
  nextCallback,
  backCallback,
  onCreateOutreach = async () => {},
  onScheduleOutreach = async () => {},
  type,
  schedule,
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
            value={state.date}
            onChange={(e) => {
              // TODO: this should create the date object here, not just a
              //  string that then always has to be converted everywhere else
              //  it's used
              onChangeField('date', e.target.value)

              const selectedDate = new Date(e.target.value)
              const minDateObj = new Date(minDate)

              if (selectedDate >= minDateObj) {
                setDateError(null)
              } else {
                setDateError('Date must be at least 72 hours from now')
              }
            }}
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
              Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
