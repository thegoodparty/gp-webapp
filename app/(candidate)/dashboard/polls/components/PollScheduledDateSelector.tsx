import DateInputCalendar from '@shared/inputs/DateInputCalendar'
import {
  addBusinessDays,
  addDays,
  isWeekend,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from 'date-fns'
import { useState } from 'react'
import { DayProps, Day } from 'react-day-picker'
import MuiTooltip from '@mui/material/Tooltip'

export const POLLS_SCHEDULING_COPY =
  'All polls are sent at 11am local time. You can schedule at least 2 business days in advance, and no more than 30 days out.'

export type PollScheduledDateSelectorProps = {
  scheduledDate: Date | undefined
  onChange: (date: Date | undefined) => void
}

type DisabledState =
  | { disabled: false }
  | { disabled: true; reason: string | undefined }

const getDisabledState = (date: Date, now: Date): DisabledState => {
  const maxDate = addDays(now, 30)

  if (date <= addBusinessDays(now, 2)) {
    return { disabled: true, reason: undefined }
  }
  if (date > maxDate) {
    return {
      disabled: true,
      reason: 'Cannot schedule more than 30 days in advance',
    }
  }
  if (isWeekend(date)) {
    return { disabled: true, reason: 'Cannot schedule on the weekend' }
  }
  return { disabled: false }
}

const CustomDay = (props: DayProps) => {
  const [now] = useState(() => startOfDay(new Date()))

  const disabledState = getDisabledState(props.day.date, now)

  if (!disabledState.disabled || !disabledState.reason) {
    return <Day {...props} />
  }

  return (
    <MuiTooltip
      style={{ backgroundColor: 'black', opacity: 100 }}
      classes={{
        tooltip: '!bg-black !opacity-100',
        arrow: '!text-black !opacity-100',
      }}
      title={
        <p className="text-sm text-white text-center my-0.5">
          {disabledState.reason}
        </p>
      }
      arrow
      placement="top"
    >
      <Day {...props} />
    </MuiTooltip>
  )
}

export const PollScheduledDateSelector: React.FC<
  PollScheduledDateSelectorProps
> = ({ scheduledDate, onChange }) => {
  const [now] = useState(() => startOfDay(new Date()))

  const maxDate = addDays(now, 30)

  return (
    <>
      <DateInputCalendar
        value={scheduledDate}
        onChange={(date) => {
          if (!date) {
            onChange(date)
            return
          }
          // We always set the time to 11:00 AM local time for the current user.
          let at11Am = date
          at11Am = setHours(date, 11)
          at11Am = setMinutes(at11Am, 0)
          at11Am = setSeconds(at11Am, 0)
          onChange(at11Am)
        }}
        disabled={(date) => getDisabledState(date, now).disabled}
        startMonth={now}
        endMonth={maxDate}
        components={{ Day: CustomDay }}
      />

      <p className="mt-4 text-sm text-muted-foreground text-center">
        * Messages sent on Tuesdays or Thursdays receive the highest engagement.
      </p>
    </>
  )
}
