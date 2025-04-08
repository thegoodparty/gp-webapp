'use client'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import TextField from '@shared/inputs/TextField'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import { buildTrackingAttrs } from 'helpers/fullStoryHelper'
import { useState, useMemo } from 'react'
import { getDefaultVoterFileName } from 'app/(candidate)/dashboard/voter-records/components/VoterFileTypes'
import { useSnackbar } from 'helpers/useSnackbar'

export default function ScheduleFlowScheduleStep({
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
    const resp = await submitCallback()

    if (resp.ok === false || resp.errors) {
      errorSnackbar('Failed to submit request.')
      return
    }

    successSnackbar('Request submitted successfully.')
    nextCallback()
  }
  const isTel = type === 'telemarketing'
  const today = new Date()
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + 3)
  const minDate = futureDate.toISOString().split('T')[0]
  return (
    <div className="p-4 w-[80vw] max-w-xl">
      <div className="text-center">
        <H1>
          Schedule Campaign for:
          <br />
          <span className="text-tertiary">{resolvedFileName}</span>
        </H1>
        <Body1 className="mt-4 mb-8">
          Use the from below to schedule your{' '}
          {isTel ? 'phone banking' : 'texting'} campaign with our politics team.
          Please note that we require a minimum of 72 hours prior to the send
          date to coordinate your campaign.
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
            <SecondaryButton onClick={backCallback}>Back</SecondaryButton>
          </div>
          <div className="col-span-6 text-right mt-6">
            <PrimaryButton
              onClick={handleNext}
              disabled={!canSubmit()}
              {...trackingAttrs}
            >
              Submit
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}
