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

export type PollScheduledDateSelectorProps = {
  scheduledDate: Date | undefined
  onChange: (date: Date | undefined) => void
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
        // We only allow scheduling polls 2 days in advance and up to 30 days in advance
        disabled={(date) =>
          date <= addBusinessDays(now, 2) || date > maxDate || isWeekend(date)
        }
        startMonth={now}
        endMonth={maxDate}
      />

      <p className="mt-4 text-sm text-muted-foreground text-center">
        * Messages sent on Tuesdays or Thursdays receive the highest engagement.
      </p>
    </>
  )
}
