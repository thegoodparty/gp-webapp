import { describe, expect, it } from 'vitest'
import {
  formatBriefingMeetingDate,
  formatBriefingMeetingTime,
  formatDayTime,
  formatShortDate,
} from './dateHelpers'

describe('formatBriefingMeetingDate', () => {
  it('formats a yyyy-MM-dd date as "EEE MMM d"', () => {
    expect(formatBriefingMeetingDate('2026-05-11')).toBe('Mon May 11')
  })

  it('returns an empty string for missing input', () => {
    expect(formatBriefingMeetingDate(undefined)).toBe('')
    expect(formatBriefingMeetingDate('')).toBe('')
  })

  it('falls back to the raw string for unparseable input', () => {
    expect(formatBriefingMeetingDate('not-a-date')).toBe('not-a-date')
  })
})

describe('formatBriefingMeetingTime', () => {
  it('formats a 24-hour HH:MM string as 12-hour with AM/PM', () => {
    expect(formatBriefingMeetingTime('00:00')).toBe('12:00 AM')
    expect(formatBriefingMeetingTime('09:30')).toBe('9:30 AM')
    expect(formatBriefingMeetingTime('12:00')).toBe('12:00 PM')
    expect(formatBriefingMeetingTime('18:00')).toBe('6:00 PM')
    expect(formatBriefingMeetingTime('23:59')).toBe('11:59 PM')
  })

  it('returns an empty string for missing input', () => {
    expect(formatBriefingMeetingTime(undefined)).toBe('')
    expect(formatBriefingMeetingTime('')).toBe('')
  })

  it('rejects out-of-range hours and returns the raw input', () => {
    // Bugbot regression: "25:00" used to slip through `h24 % 12` and become
    // "1:00 PM"; we now refuse to normalize anything outside 0–23.
    expect(formatBriefingMeetingTime('25:00')).toBe('25:00')
    expect(formatBriefingMeetingTime('99:00')).toBe('99:00')
    expect(formatBriefingMeetingTime('-1:00')).toBe('-1:00')
  })

  it('rejects out-of-range minutes and returns the raw input', () => {
    expect(formatBriefingMeetingTime('10:60')).toBe('10:60')
    expect(formatBriefingMeetingTime('10:99')).toBe('10:99')
  })

  it('rejects malformed input shapes and returns the raw input', () => {
    expect(formatBriefingMeetingTime('not-a-time')).toBe('not-a-time')
    expect(formatBriefingMeetingTime('10')).toBe('10')
    expect(formatBriefingMeetingTime('10:0')).toBe('10:0')
  })
})

describe('formatDayTime', () => {
  it('returns the weekday alone for a date-only string (no time known)', () => {
    // User-supplied agenda for an off-platform meeting: buildScheduledAt
    // emits a bare yyyy-MM-dd and we must not fabricate a midnight time or
    // render "Invalid Date".
    expect(formatDayTime('2026-06-08')).toBe('Mon')
  })
})

describe('formatShortDate', () => {
  it('formats a date-only string in UTC without an off-by-one shift', () => {
    expect(formatShortDate('2026-06-08')).toBe('Jun 8')
  })
})
