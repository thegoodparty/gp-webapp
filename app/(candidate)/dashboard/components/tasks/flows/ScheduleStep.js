'use client'
import TextField from '@shared/inputs/TextField'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import { buildTrackingAttrs } from 'helpers/fullStoryHelper'
import { useState, useMemo } from 'react'
import { getDefaultVoterFileName } from 'app/(candidate)/dashboard/voter-records/components/VoterFileTypes'
import { useSnackbar } from 'helpers/useSnackbar'
import Button from '@shared/buttons/Button'
import {
  LEGACY_TASK_TYPES,
  TASK_TYPES,
} from '../../../shared/constants/tasks.const'

export default function ScheduleStep({
  onChangeCallback,
  nextCallback,
  backCallback,
  submitCallback,
  fileName,
  type,
  schedule,
}) {
  const { errorSnackbar, successSnackbar } = useSnackbar()
  const [state, setState] = useState(
    schedule || {
      date: '',
      message: '',
    },
  )
  const [isLoading, setIsLoading] = useState(false)

  const resolvedFileName = useMemo(
    () => (fileName ? fileName : getDefaultVoterFileName(type)),
    [fileName, type],
  )

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

  const canSubmit = () => state.date != '' && state.message != ''

  const handleNext = async () => {
    setIsLoading(true)
    const resp = await submitCallback()

    if (resp.ok === false || resp.errors) {
      errorSnackbar('Failed to submit request.')
      return
    }

    successSnackbar('Request submitted successfully.')
    setIsLoading(false)
    nextCallback()
  }
  const isTel =
    type === LEGACY_TASK_TYPES.telemarketing || type === TASK_TYPES.robocall
  const today = new Date()
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + 3)
  const minDate = futureDate.toISOString().split('T')[0]
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
              onChangeField('date', e.target.value)
            }}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: minDate,
            }}
          />
        </div>
        <div className="mt-4">
          <TextField
            label="Message"
            placeholder="Do you have any additional questions or asks?"
            multiline
            rows={5}
            fullWidth
            required
            value={state.message}
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
