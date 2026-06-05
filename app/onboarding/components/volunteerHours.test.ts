import { describe, expect, it } from 'vitest'
import {
  CANDIDATE_HOURS_PER_WEEK,
  DEFAULT_WEEKS_REMAINING,
  computeCampaignHours,
  resolveWeeksRemaining,
} from './volunteerHours'

describe('resolveWeeksRemaining', () => {
  it('falls back to the default when no date is given', () => {
    expect(resolveWeeksRemaining(null)).toBe(DEFAULT_WEEKS_REMAINING)
    expect(resolveWeeksRemaining(undefined)).toBe(DEFAULT_WEEKS_REMAINING)
  })

  it('falls back to the default for an invalid date', () => {
    expect(resolveWeeksRemaining('not-a-date')).toBe(DEFAULT_WEEKS_REMAINING)
  })

  it('falls back to the default when the election has already passed', () => {
    expect(resolveWeeksRemaining(new Date('2000-01-01'))).toBe(
      DEFAULT_WEEKS_REMAINING,
    )
  })

  it('rounds up to whole weeks for a future date', () => {
    const tenDaysOut = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    expect(resolveWeeksRemaining(tenDaysOut)).toBe(2)
  })
})

describe('computeCampaignHours', () => {
  const subject = computeCampaignHours(10_000, 8)

  it('sets the door-knocking goal at 20% of the contact goal', () => {
    expect(subject.doorGoal).toBe(2_000)
  })

  it('derives volunteer hours from the door goal at 10 contacts per hour', () => {
    // 2,000 doors / 10 per hour = 200 hours.
    expect(subject.volunteerHours).toBe(200)
  })

  it('sets candidate hours as a flat weekly commitment over the weeks left', () => {
    expect(subject.candidateHoursPerWeek).toBe(CANDIDATE_HOURS_PER_WEEK)
    expect(subject.candidateHours).toBe(CANDIDATE_HOURS_PER_WEEK * 8)
  })

  it('totals volunteer and candidate hours', () => {
    expect(subject.totalHours).toBe(
      subject.volunteerHours + subject.candidateHours,
    )
  })

  it('rounds volunteer hours up so a partial hour still counts', () => {
    // 1,001 contacts -> 200 doors -> 20 hours; 1,005 -> 201 doors -> 21 hours.
    expect(computeCampaignHours(1_005, 8).volunteerHours).toBe(21)
  })
})
