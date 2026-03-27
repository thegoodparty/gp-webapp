import { describe, it, expect, vi, afterEach } from 'vitest'
import { timeToNextElection } from './dateHelper'

const toLocalDateString = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const futureDate = (weeks: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + weeks * 7 + 1)
  return toLocalDateString(d)
}

const pastDate = (weeks: number): string => {
  const d = new Date()
  d.setDate(d.getDate() - weeks * 7)
  return toLocalDateString(d)
}

describe('timeToNextElection', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns false for null date', () => {
    expect(timeToNextElection(null)).toBe(false)
  })

  it('returns false for undefined date', () => {
    expect(timeToNextElection(undefined)).toBe(false)
  })

  it('returns weeks string for a future date', () => {
    const result = timeToNextElection(futureDate(8))
    expect(result).toMatch(/^\d+ weeks?$/)
  })

  it('returns days string when date is less than a week away', () => {
    const threeDaysOut = new Date()
    threeDaysOut.setDate(threeDaysOut.getDate() + 3)
    const result = timeToNextElection(toLocalDateString(threeDaysOut))
    expect(result).toMatch(/^\d+ days?$/)
  })

  it('uses singular "day" when date is 1 day away', () => {
    const oneDayOut = new Date()
    oneDayOut.setDate(oneDayOut.getDate() + 1)
    const result = timeToNextElection(toLocalDateString(oneDayOut))
    expect(result).toBe('1 day')
  })

  it('uses singular "week" when date is 1 week away', () => {
    const result = timeToNextElection(futureDate(1))
    expect(result).toBe('1 week')
  })

  it('returns false when date is in the past', () => {
    const result = timeToNextElection(pastDate(3))
    expect(result).toBe(false)
  })

  it('returns false for unparseable date like "TBD"', () => {
    const result = timeToNextElection('TBD')
    expect(result).toBe(false)
  })

  it('returns false on today (0 days away)', () => {
    const today = toLocalDateString(new Date())
    const result = timeToNextElection(today)
    expect(result).toBe(false)
  })
})
