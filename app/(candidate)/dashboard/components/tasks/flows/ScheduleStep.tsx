'use client'
import TextField from '@shared/inputs/TextField'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import { buildTrackingAttrs } from 'helpers/analyticsHelper'
import { useMemo, useState, ChangeEvent } from 'react'
import Button from '@shared/buttons/Button'
import { TASK_TYPES } from '../../../shared/constants/tasks.const'
import { addDays, format, parseISO, startOfDay } from 'date-fns'
import { Outreach } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'

interface ScheduleState {
  date?: Date | string
  message?: string
}

interface ScheduleStepProps {
  onChangeCallback: (key: string, value: ScheduleState) => void
  nextCallback: () => void
  backCallback: () => void
  onCreateOutreach?: () => Promise<Outreach | undefined>
  onScheduleOutreach?: (outreach?: Outreach) => Promise<void>
  type: string
  schedule?: ScheduleState
  isLastStep?: boolean
}

export default function ScheduleStep({
  onChangeCallback,
  nextCallback,
  backCallback,
  onCreateOutreach = async () => undefined,
  onScheduleOutreach = async () => {},
  type,
  schedule,
  isLastStep,
}: ScheduleStepProps): React.JSX.Element {
  const [state, setState] = useState<ScheduleState>(
    schedule || {
      date: '',
      message: '',
    },
  )
  const [dateError, setDateError] = useState<string | null>('')
  const [isLoading, setIsLoading] = useState(false)

  const trackingAttrs = useMemo(
    () =>
      buildTrackingAttrs('Schedule Contact Campaign Submit Button', { type }),
    [type],
  )

  const onChangeField = (key: keyof ScheduleState, value: Date | string) => {
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

  // This conversion has to be done to appease MUI's date-type TextField
  const dateTextFieldValue = state?.date
    ? format(new Date(state.date), 'yyyy-MM-dd')
    : ''
  const isRobocall = type === TASK_TYPES.robocall // Check specifically for robocall type
  const isTextMessage = type === TASK_TYPES.text // Check specifically for text message type
  const today = new Date()
  const minDate = addDays(today, 3).toISOString().split('T')[0] || ''

  const handleTextFieldOnChange = (e: ChangeEvent<HTMLInputElement>) => {
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
  return (
    <div className="p-4 w-[80vw] max-w-xl">
      <div className="text-center">
        <H1>
          {isRobocall
            ? 'Request robocall'
            : isTextMessage
            ? 'Schedule text message'
            : 'Schedule campaign'}
        </H1>{' '}
        {/* Dynamic header: "Request" for robocall, "Schedule text message" for text, "Schedule campaign" for others */}
        <Body1 className="mt-4 mb-8">
          {' '}
          {/* Description text with margin spacing */}
          {isRobocall ? (
            <>
              Your Political Assistant will need an audio recording. Look out
              for an email with detailed instructions. This is required.{' '}
              {/* Robocall-specific messaging */}
              <br />
              <strong>Requires 3 days to process.</strong>{' '}
              {/* Processing time requirement */}
            </>
          ) : (
            <>
              Use the form below to schedule your campaign.{' '}
              {/* Default messaging for non-robocall types */}
              <br />
              <strong>Requires 3 days to process.</strong>{' '}
              {/* Processing time requirement */}
            </>
          )}
        </Body1>
        <div className="mt-4">
          <TextField
            fullWidth
            label={isRobocall ? 'Call date' : 'Send date'} // Dynamic label: "Call date" for robocall, "Send date" for others
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
              {isLastStep ? (isRobocall ? 'Send' : 'Schedule') : 'Next'}{' '}
              {/* Dynamic button text: Request for robocall, Schedule for others, Next for non-last steps */}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
