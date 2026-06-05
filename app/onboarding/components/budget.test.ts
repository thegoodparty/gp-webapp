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

  it('adds a rounded 5% contingency on top of the subtotal', () => {
    const subtotal =
      subject.textCost +
      subject.robocallCost +
      subject.literatureCost +
      subject.mailCost +
      YARD_SIGNS_COST +
      subject.filingFee
    expect(subject.subtotal).toBe(subtotal)
    expect(subject.contingency).toBe(Math.round(subtotal * CONTINGENCY_RATE))
  })

  it('keeps the displayed line items summing exactly to the total', () => {
    // Regression guard: every cost is whole-dollar, so the rows the UI shows
    // add up to the total it shows. Inputs chosen to produce fractional
    // pre-rounding costs (e.g. 300 texts × $0.035 = $10.50).
    const b = computeBudget(500, 400, 100)
    const rowSum =
      b.textCost +
      b.robocallCost +
      b.literatureCost +
      b.mailCost +
      b.yardSignsCost +
      b.filingFee +
      b.contingency
    expect(rowSum).toBe(b.totalBudget)
    expect(Number.isInteger(b.textCost)).toBe(true)
    expect(Number.isInteger(b.mailCost)).toBe(true)
    expect(Number.isInteger(b.contingency)).toBe(true)
  })

  it('produces no spurious literature pack when the contact goal is zero', () => {
    const empty = computeBudget(0, 0, null)
    expect(empty.doorGoal).toBe(0)
    expect(empty.literaturePieces).toBe(0)
    expect(empty.literaturePacks).toBe(0)
    expect(empty.literatureCost).toBe(0)
  })
})
