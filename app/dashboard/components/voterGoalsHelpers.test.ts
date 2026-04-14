import { describe, it, expect } from 'vitest'
import {
  calculateContactGoalsFromCampaign,
  getVoterContactsGoal,
} from './voterGoalsHelpers'
import type { Campaign, RaceTargetMetrics } from 'helpers/types'

const makeCampaign = (metrics?: Partial<RaceTargetMetrics> | null): Campaign =>
  ({
    raceTargetMetrics:
      metrics === null
        ? null
        : metrics
        ? {
            projectedTurnout: 0,
            winNumber: 0,
            voterContactGoal: 0,
            ...metrics,
          }
        : undefined,
  } as unknown as Campaign)

describe('getVoterContactsGoal', () => {
  it('returns voterContactGoal when positive', () => {
    expect(
      getVoterContactsGoal({
        projectedTurnout: 0,
        winNumber: 0,
        voterContactGoal: 1000,
      }),
    ).toBe(1000)
  })

  it('returns 0 when voterContactGoal is 0', () => {
    expect(
      getVoterContactsGoal({
        projectedTurnout: 0,
        winNumber: 200,
        voterContactGoal: 0,
      }),
    ).toBe(0)
  })

  it('returns 0 when metrics are null', () => {
    expect(getVoterContactsGoal(null)).toBe(0)
  })

  it('returns 0 when metrics are undefined', () => {
    expect(getVoterContactsGoal(undefined)).toBe(0)
  })
})

describe('calculateContactGoalsFromCampaign', () => {
  it('distributes voterContactGoal across weeks', () => {
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

  it('returns false when voterContactGoal is 0', () => {
    const result = calculateContactGoalsFromCampaign(
      makeCampaign({ voterContactGoal: 0 }),
    )
    expect(result).toBe(false)
  })

  it('returns false when raceTargetMetrics is undefined', () => {
    const result = calculateContactGoalsFromCampaign(makeCampaign())
    expect(result).toBe(false)
  })

  it('returns false when raceTargetMetrics is null', () => {
    const result = calculateContactGoalsFromCampaign(makeCampaign(null))
    expect(result).toBe(false)
  })
})
