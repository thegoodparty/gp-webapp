import { describe, it, expect } from 'vitest'
import { calculateContactGoalsFromCampaign } from './voterGoalsHelpers'
import type { Campaign } from 'helpers/types'

const makeCampaign = (
  overrides: { voterContactGoal?: number; winNumber?: number } = {},
): Campaign =>
  ({
    raceTargetMetrics:
      overrides.voterContactGoal !== undefined ||
      overrides.winNumber !== undefined
        ? {
            projectedTurnout: 0,
            winNumber: overrides.winNumber ?? 0,
            voterContactGoal: overrides.voterContactGoal ?? 0,
          }
        : undefined,
  } as unknown as Campaign)

describe('calculateContactGoalsFromCampaign', () => {
  it('uses voterContactGoal when available', () => {
    const result = calculateContactGoalsFromCampaign(
      makeCampaign({ voterContactGoal: 1000 }),
    )
    expect(result).not.toBe(false)
    if (result) {
      const totalAcrossWeeks = (
        Object.values(result) as { total: number }[]
      ).reduce((sum, week) => sum + week.total, 0)
      expect(totalAcrossWeeks).toBeGreaterThan(0)
    }
  })

  it('returns false when voterContactGoal is 0 and winNumber is 0', () => {
    const result = calculateContactGoalsFromCampaign(
      makeCampaign({ voterContactGoal: 0, winNumber: 0 }),
    )
    expect(result).toBe(false)
  })

  it('falls back to winNumber * 5 when voterContactGoal is 0 but winNumber is set', () => {
    const fromWin = calculateContactGoalsFromCampaign(
      makeCampaign({ voterContactGoal: 0, winNumber: 200 }),
    )
    const fromContact = calculateContactGoalsFromCampaign(
      makeCampaign({ voterContactGoal: 1000 }),
    )
    expect(fromWin).toEqual(fromContact)
  })

  it('returns false when both voterContactGoal and voteGoal are undefined', () => {
    const result = calculateContactGoalsFromCampaign(makeCampaign())
    expect(result).toBe(false)
  })

  it('returns false when raceTargetMetrics is undefined', () => {
    const campaign = { raceTargetMetrics: undefined } as unknown as Campaign
    const result = calculateContactGoalsFromCampaign(campaign)
    expect(result).toBe(false)
  })

  it('returns false when raceTargetMetrics is null', () => {
    const campaign = { raceTargetMetrics: null } as unknown as Campaign
    const result = calculateContactGoalsFromCampaign(campaign)
    expect(result).toBe(false)
  })

  it('prefers voterContactGoal over winNumber when both are present', () => {
    const result = calculateContactGoalsFromCampaign(
      makeCampaign({ voterContactGoal: 500, winNumber: 200 }),
    )
    const fromContactOnly = calculateContactGoalsFromCampaign(
      makeCampaign({ voterContactGoal: 500 }),
    )
    expect(result).toEqual(fromContactOnly)
  })
})
