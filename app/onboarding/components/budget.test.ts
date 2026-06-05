import { describe, expect, it } from 'vitest'
import {
  CONTINGENCY_RATE,
  DEFAULT_FILING_FEE,
  LITERATURE_PACK_COST,
  LITERATURE_PACK_SIZE,
  YARD_SIGNS_COST,
  computeBudget,
  resolveVoterContactGoal,
} from './budget'

describe('resolveVoterContactGoal', () => {
  it('uses the race-specific goal when it is positive', () => {
    expect(resolveVoterContactGoal(8000, 1000)).toBe(8000)
  })

  it('falls back to winNumber * 5 when the goal is missing', () => {
    expect(resolveVoterContactGoal(null, 1000)).toBe(5000)
    expect(resolveVoterContactGoal(undefined, 1000)).toBe(5000)
  })

  it('falls back when the goal is zero or negative', () => {
    expect(resolveVoterContactGoal(0, 1000)).toBe(5000)
    expect(resolveVoterContactGoal(-50, 1000)).toBe(5000)
  })

  it('rounds the win-number fallback to a whole contact count', () => {
    expect(resolveVoterContactGoal(null, 333)).toBe(1665)
  })
})

describe('computeBudget', () => {
  // contactGoal 10,000 and projectedTurnout 5,000 give round numbers so the
  // expected figures below are easy to verify by hand.
  const subject = computeBudget(10_000, 5_000, null)

  it('splits texts as 60% of the contact goal', () => {
    expect(subject.textCount).toBe(6_000)
  })

  it('splits robocalls as 20% of the contact goal', () => {
    expect(subject.robocallCount).toBe(2_000)
  })

  it('sets the door-knocking goal at 20% of the contact goal', () => {
    expect(subject.doorGoal).toBe(2_000)
  })

  it('prints one literature piece per door (door hanger or palm card, not both)', () => {
    // Guards the deliberate 1-piece-per-door model: pieces must equal doors,
    // never double them.
    expect(subject.literaturePieces).toBe(subject.doorGoal)
    expect(subject.literaturePacks).toBe(
      Math.ceil(subject.doorGoal / LITERATURE_PACK_SIZE),
    )
    expect(subject.literatureCost).toBe(
      subject.literaturePacks * LITERATURE_PACK_COST,
    )
  })

  it('sizes direct mail at 40% of projected turnout', () => {
    expect(subject.mailCount).toBe(2_000)
  })

  it('falls back to the default filing fee and flags it when none is given', () => {
    expect(subject.filingFee).toBe(DEFAULT_FILING_FEE)
    expect(subject.filingFeeIsDefault).toBe(true)
  })

  it('uses a provided filing fee without flagging it as default', () => {
    const withFee = computeBudget(10_000, 5_000, 250)
    expect(withFee.filingFee).toBe(250)
    expect(withFee.filingFeeIsDefault).toBe(false)
  })

  it('adds a 5% contingency and rounds the total', () => {
    const subtotal =
      subject.textCost +
      subject.robocallCost +
      subject.literatureCost +
      subject.mailCost +
      YARD_SIGNS_COST +
      subject.filingFee
    expect(subject.subtotal).toBe(subtotal)
    expect(subject.contingency).toBe(subtotal * CONTINGENCY_RATE)
    expect(subject.totalBudget).toBe(
      Math.round(subtotal + subtotal * CONTINGENCY_RATE),
    )
  })

  it('produces no spurious literature pack when the contact goal is zero', () => {
    const empty = computeBudget(0, 0, null)
    expect(empty.doorGoal).toBe(0)
    expect(empty.literaturePieces).toBe(0)
    expect(empty.literaturePacks).toBe(0)
    expect(empty.literatureCost).toBe(0)
  })
})
