/**
 * Date helpers for the briefings UI.
 *
 * Server-side rendered so countdowns are stable per request and there is no
 * hydration mismatch with the client.
 */
import { format, parseISO } from 'date-fns'

/**
 * Whole days between today and the target date, comparing at day boundaries
 * in UTC so timezones do not move the count by one.
 */
export function daysUntil(targetIso: string, now: Date = new Date()): number {
  const target = new Date(targetIso)
  const targetDay = Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate(),
  )
  const nowDay = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  )
  return Math.round((targetDay - nowDay) / (1000 * 60 * 60 * 24))
}

/**
 * Compact countdown text used in the UPCOMING pill, e.g. "2 DAYS", "TODAY".
 * Returns null for past dates so the caller can suppress the pill.
 */
export function countdownLabel(
  targetIso: string,
  now: Date = new Date(),
): string | null {
  const days = daysUntil(targetIso, now)
  if (days < 0) return null
  if (days === 0) return 'TODAY'
  if (days === 1) return '1 DAY'
  return `${days} DAYS`
}

/**
 * A bare `yyyy-MM-dd` with no time component. `buildScheduledAt` emits this
 * when the meeting time is unknown (e.g. a user-supplied agenda for an
 * off-platform meeting); the formatters below render the date and omit the
 * time rather than fabricating midnight or producing "Invalid Date".
 */
const isDateOnly = (iso: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(iso)

/**
 * Short weekday + time for list rows, e.g. "Mon 6:00 PM". When no time is
 * known (date-only input) the weekday is returned alone, e.g. "Mon".
 */
export function formatDayTime(targetIso: string): string {
  if (isDateOnly(targetIso)) {
    return new Date(`${targetIso}T00:00:00Z`).toLocaleDateString('en-US', {
      weekday: 'short',
      timeZone: 'UTC',
    })
  }
  const d = new Date(targetIso)
  const day = d.toLocaleDateString('en-US', { weekday: 'short' })
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${day} ${time}`
}

/**
 * Short date for list rows, e.g. "Jun 1".
 */
export function formatShortDate(targetIso: string): string {
  if (isDateOnly(targetIso)) {
    return new Date(`${targetIso}T00:00:00Z`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
  }
  return new Date(targetIso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a briefing meeting date (`yyyy-MM-dd` in the meeting's local
 * timezone) as a compact "EEE MMM d" string, e.g. `Tue May 26`. Empty
 * input or unparseable input falls back to the raw string so the share
 * sheet / PDF never blank out the line entirely.
 */
export function formatBriefingMeetingDate(
  meetingDate: string | undefined,
): string {
  if (!meetingDate) return ''
  // date-fns is already a transitive dep across the briefings UI; it gives
  // us a comma-free "EEE MMM d" output that `Intl.DateTimeFormat` would
  // require post-processing to match.
  try {
    return format(parseISO(meetingDate), 'EEE MMM d')
  } catch {
    return meetingDate
  }
}

/**
 * Format a briefing meeting time (`HH:MM` 24h in the meeting's local
 * timezone) as a 12-hour clock string, e.g. `7:00 PM`. Returns an empty
 * string if `meetingTime` is missing; returns the raw string if it can't
 * be parsed (defense-in-depth for malformed artifacts).
 */
export function formatBriefingMeetingTime(
  meetingTime: string | undefined,
): string {
  if (!meetingTime) return ''
  const [hhRaw, mmRaw] = meetingTime.split(':')
  const h24 = Number(hhRaw)
  const mm = mmRaw ?? ''
  const mmNum = Number(mm)
  // Validate not just shape but also the range. "25:00" or "-1:00" parsed as
  // numbers would silently produce "1:00 PM" / "-1:00 AM" otherwise; return
  // the raw input instead so the caller can either show it as-is or treat
  // it as malformed and suppress.
  if (
    !Number.isFinite(h24) ||
    h24 < 0 ||
    h24 > 23 ||
    mm.length !== 2 ||
    !Number.isFinite(mmNum) ||
    mmNum < 0 ||
    mmNum > 59
  ) {
    return meetingTime
  }
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${mm} ${ampm}`
}
