const ONE_HOUR = 60 * 60 * 1000

export type DateInput = Date | string | number | null | undefined

const invalidDateFormat = (date: DateInput): boolean =>
  !date ||
  (typeof date === 'string' &&
    [' ', '', 'null', 'N/A', 'n/a', 'Invalid Date'].includes(date))

export const isInvalidDateObject = (date: DateInput): boolean =>
  typeof date === 'object' && date !== null && isNaN(date.getTime())

export const dateUsHelper = (
  orgDate: DateInput,
  monthFormat: 'short' | 'long' = 'short',
): string => {
  if (invalidDateFormat(orgDate)) {
    return String(orgDate ?? '')
  } else if (isInvalidDateObject(orgDate)) {
    return ''
  }
  try {
    const date = new Date(orgDate as string | number | Date)
    const pstDate = new Date(date.getTime() + 8 * ONE_HOUR)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: monthFormat,
      day: 'numeric',
    }).format(pstDate)
  } catch (err) {
    console.error('error', err, `orgDate => ${orgDate}`)
    return ''
  }
}

export const dateWithTime = (orgDate: DateInput): string => {
  if (invalidDateFormat(orgDate)) {
    return String(orgDate ?? '')
  } else if (isInvalidDateObject(orgDate)) {
    return ''
  }
  const date = new Date(orgDate as string | number | Date)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}

export const daysTill = (date: DateInput): string | number => {
  if (invalidDateFormat(date)) {
    return '0'
  } else if (isInvalidDateObject(date)) {
    return ''
  }
  const now = new Date()
  const dateStr = String(date)
  const inputDate = new Date(dateStr.replace(/-/g, '/'))

  const timeDiff = inputDate.getTime() - now.getTime()

  const daysDiff = timeDiff / (1000 * 3600 * 24)
  return Math.ceil(daysDiff)
}

export const weeksTill = (
  date: DateInput,
): { weeks: number; days: number } | string | false => {
  if (invalidDateFormat(date)) {
    return false
  } else if (isInvalidDateObject(date)) {
    return ''
  }
  const days = daysTill(date)
  const daysNum = typeof days === 'string' ? parseInt(days, 10) : days
  const weeks = Math.floor(daysNum / 7)
  const remainder = daysNum - weeks * 7
  return { weeks, days: remainder }
}

export const weekRangeFromDate = (
  dateStr: string | null | undefined,
  weeks: number | null | undefined,
): string => {
  if (invalidDateFormat(dateStr) || !weeks) {
    return ''
  }
  const weekStart = new Date(dateStr as string)
  weekStart.setDate(weekStart.getDate() - 7 * (weeks + 1))

  const weekEnd = new Date(dateStr as string)
  weekEnd.setDate(weekEnd.getDate() - 7 * weeks)

  return `${dateUsHelper(weekStart)} - ${dateUsHelper(weekEnd)}`
}

export const dateUSClientLocaleHelper = (utcTimeSecs: number): string =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(new Date(utcTimeSecs * 1000))

export const dateFromNonStandardUSFormatString = (
  dateStr: string | null | undefined,
): Date | string => {
  if (invalidDateFormat(dateStr)) {
    return dateStr ?? ''
  }
  const [year = 0, month = 1, day = 1] = (dateStr as string)
    .split('-')
    .map(Number)
  return new Date(year, month - 1, day)
}

export const isSameDay = (date1: Date, date2: Date): boolean =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate()
