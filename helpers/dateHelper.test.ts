import { describe, it, expect, vi, afterEach } from 'vitest'
import { timeToNextElection } from './dateHelper'
import type { Campaign } from './types'

const makeCampaign = (details: Partial<Campaign['details']> = {}): Campaign =>
  ({
    details: {
      electionDate: undefined,
      primaryElectionDate: undefined,
      ...details,
    },
  } as unknown as Campaign)

const futureDate = (weeks: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + weeks * 7 + 1)
  return d.toISOString().split('T')[0]!
}

const pastDate = (weeks: number): string => {
  const d = new Date()
  d.setDate(d.getDate() - weeks * 7)
  return d.toISOString().split('T')[0]!
}

describe('timeToNextElection', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns false for null campaign', () => {
    expect(timeToNextElection(null)).toBe(false)
  })

  it('returns false when campaign has no details', () => {
    const campaign = { details: undefined } as unknown as Campaign
    expect(timeToNextElection(campaign)).toBe(false)
  })

  it('returns false when no election dates are set', () => {
    expect(timeToNextElection(makeCampaign())).toBe(false)
  })

  it('returns weeks string for a future general election', () => {
    const result = timeToNextElection(
      makeCampaign({ electionDate: futureDate(8) }),
    )
    expect(result).toMatch(/^\d+ weeks? away$/)
  })

  it('returns days string when election is less than a week away', () => {
    const threeDaysOut = new Date()
    threeDaysOut.setDate(threeDaysOut.getDate() + 3)
    const result = timeToNextElection(
      makeCampaign({
        electionDate: threeDaysOut.toISOString().split('T')[0],
      }),
    )
    expect(result).toMatch(/^\d+ days? away$/)
  })

  it('uses singular "day" when election is 1 day away', () => {
    const oneDayOut = new Date()
    oneDayOut.setDate(oneDayOut.getDate() + 1)
    const result = timeToNextElection(
      makeCampaign({
        electionDate: oneDayOut.toISOString().split('T')[0],
      }),
    )
    expect(result).toBe('1 day away')
  })

  it('uses singular "week" when election is 1 week away', () => {
    const result = timeToNextElection(
      makeCampaign({ electionDate: futureDate(1) }),
    )
    expect(result).toBe('1 week away')
  })

  it('uses primary election date when it is in the future', () => {
    const result = timeToNextElection(
      makeCampaign({
        electionDate: futureDate(20),
        primaryElectionDate: futureDate(4),
      }),
    )
    expect(result).toMatch(/^4 weeks away$/)
  })

  it('falls back to general election when primary is in the past', () => {
    const result = timeToNextElection(
      makeCampaign({
        electionDate: futureDate(10),
        primaryElectionDate: pastDate(2),
      }),
    )
    expect(result).toMatch(/^\d+ weeks? away$/)
  })

  it('returns false when both elections are in the past', () => {
    const result = timeToNextElection(
      makeCampaign({
        electionDate: pastDate(4),
        primaryElectionDate: pastDate(8),
      }),
    )
    expect(result).toBe(false)
  })

  it('returns false when general election is in the past and no primary set', () => {
    const result = timeToNextElection(
      makeCampaign({ electionDate: pastDate(3) }),
    )
    expect(result).toBe(false)
  })

  it('returns false for unparseable election date like "TBD"', () => {
    const result = timeToNextElection(makeCampaign({ electionDate: 'TBD' }))
    expect(result).toBe(false)
  })

  it('returns false for unparseable primary election date', () => {
    const result = timeToNextElection(
      makeCampaign({
        electionDate: 'TBD',
        primaryElectionDate: 'Not yet scheduled',
      }),
    )
    expect(result).toBe(false)
  })

  it('returns false on election day itself (0 days away)', () => {
    const today = new Date().toISOString().split('T')[0]
    const result = timeToNextElection(makeCampaign({ electionDate: today }))
    expect(result).toBe(false)
  })
})
