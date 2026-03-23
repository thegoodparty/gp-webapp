import { describe, it, expect } from 'vitest'
import { calculateContactGoalsFromCampaign } from './voterGoalsHelpers'
import type { Campaign } from 'helpers/types'

const makeCampaign = (
  overrides: { voterContactGoal?: number; voteGoal?: number } = {},
): Campaign =>
  ({
    pathToVictory: {
      data: {
        voterContactGoal: overrides.voterContactGoal,
        voteGoal: overrides.voteGoal,
      },
    },
  } as unknown as Campaign)

describe('calculateContactGoalsFromCampaign', () => {
  it('uses voterContactGoal when available', () => {
    const result = calculateContactGoalsFromCampaign(
      makeCampaign({ voterContactGoal: 1000 }),
    )
    expect(result).not.toBe(false)
    if (result) {
      const totalAcrossWeeks = Object.values(result).reduce(
        (sum, week) => sum + week.total,
        0,
      )
      expect(totalAcrossWeeks).toBeGreaterThan(0)
    }
  })

  it('falls back to voteGoal * 5 when voterContactGoal is undefined', () => {
    const fromVoteGoal = calculateContactGoalsFromCampaign(
      makeCampaign({ voteGoal: 200 }),
    )
    const fromContactGoal = calculateContactGoalsFromCampaign(
      makeCampaign({ voterContactGoal: 1000 }),
    )
    expect(fromVoteGoal).toEqual(fromContactGoal)
  })

  it('returns false when both voterContactGoal and voteGoal are undefined', () => {
    const result = calculateContactGoalsFromCampaign(makeCampaign())
    expect(result).toBe(false)
  })

  it('returns false when pathToVictory is undefined', () => {
    const campaign = { pathToVictory: undefined } as unknown as Campaign
    const result = calculateContactGoalsFromCampaign(campaign)
    expect(result).toBe(false)
  })

  it('returns false when pathToVictory.data is undefined', () => {
    const campaign = {
      pathToVictory: { data: undefined },
    } as unknown as Campaign
    const result = calculateContactGoalsFromCampaign(campaign)
    expect(result).toBe(false)
  })

  it('prefers voterContactGoal over voteGoal when both are present', () => {
    const result = calculateContactGoalsFromCampaign(
      makeCampaign({ voterContactGoal: 500, voteGoal: 200 }),
    )
    const fromContactGoal = calculateContactGoalsFromCampaign(
      makeCampaign({ voterContactGoal: 500 }),
    )
    expect(result).toEqual(fromContactGoal)
  })
})
