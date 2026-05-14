/**
 * Date helpers for the briefings UI.
 *
 * Server-side rendered so countdowns are stable per request and there is no
 * hydration mismatch with the client.
 */

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
 * Short weekday + time for list rows, e.g. "Mon 6:00 PM".
 */
export function formatDayTime(targetIso: string): string {
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
  return new Date(targetIso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
