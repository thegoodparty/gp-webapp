import { describe, it, expect, vi, afterEach } from 'vitest'
import { getNextElection } from './campaignHelper'
import type { Campaign } from './types'

const makeCampaign = (details: Partial<Campaign['details']> = {}): Campaign =>
  ({
    details: {
      electionDate: undefined,
      primaryElectionDate: undefined,
      ...details,
    },
  } as unknown as Campaign)

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

describe('getNextElection', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null for null campaign', () => {
    expect(getNextElection(null)).toBeNull()
  })

  it('returns null when campaign has no details', () => {
    const campaign = { details: undefined } as unknown as Campaign
    expect(getNextElection(campaign)).toBeNull()
  })

  it('returns null when no election dates are set', () => {
    expect(getNextElection(makeCampaign())).toBeNull()
  })

  it('returns general election date with isPrimary false', () => {
    const date = futureDate(8)
    const result = getNextElection(makeCampaign({ electionDate: date }))
    expect(result).toEqual({ nextElectionDate: date, isPrimary: false })
  })

  it('returns primary election date when it is in the future', () => {
    const primary = futureDate(4)
    const general = futureDate(20)
    const result = getNextElection(
      makeCampaign({ electionDate: general, primaryElectionDate: primary }),
    )
    expect(result).toEqual({ nextElectionDate: primary, isPrimary: true })
  })

  it('falls back to general election when primary is in the past', () => {
    const general = futureDate(10)
    const primary = pastDate(2)
    const result = getNextElection(
      makeCampaign({ electionDate: general, primaryElectionDate: primary }),
    )
    expect(result).toEqual({ nextElectionDate: general, isPrimary: false })
  })

  it('returns general election even when it is in the past', () => {
    const date = pastDate(4)
    const result = getNextElection(makeCampaign({ electionDate: date }))
    expect(result).toEqual({ nextElectionDate: date, isPrimary: false })
  })

  it('falls back to general when primary is past and general is past', () => {
    const general = pastDate(4)
    const primary = pastDate(8)
    const result = getNextElection(
      makeCampaign({ electionDate: general, primaryElectionDate: primary }),
    )
    expect(result).toEqual({ nextElectionDate: general, isPrimary: false })
  })
})
