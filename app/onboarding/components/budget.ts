// Campaign budget formula — the single source of truth shared by the
// onboarding outreach step, the campaign plan, and the plan PDF. All three
// surfaces must show the same dollar figures, so the math lives only here.

// Channel split of the voter contact goal (win number × 5). Texts and
// robocalls are paid per contact; door knocking is volunteer (no line cost)
// but its share sizes the literature drop below.
export const TEXTS_PERCENT = 0.6
export const ROBOCALLS_PERCENT = 0.2
export const DOORS_PERCENT = 0.2

export const TEXT_COST = 0.035
export const ROBOCALL_COST = 0.045
export const MAIL_COST_PER_PIECE = 0.55
// Direct mail goes to a persuadable subset of likely voters (projected
// turnout), not the full universe.
export const MAIL_UNIVERSE_RATE = 0.4

// Literature = one door hanger + one palm card per knocked door (2 pieces),
// printed in 250-piece packs.
export const LITERATURE_PIECES_PER_DOOR = 2
export const LITERATURE_PACK_SIZE = 250
export const LITERATURE_PACK_COST = 80

// Flat 50-sign order, the same for every race.
export const YARD_SIGNS_COST = 385

// Filing-fee fallback when BallotReady has no clean number for the race.
export const DEFAULT_FILING_FEE = 100

export const CONTINGENCY_RATE = 0.05

export interface BudgetComputation {
  textCount: number
  textCost: number
  robocallCount: number
  robocallCost: number
  doorGoal: number
  literaturePieces: number
  literaturePacks: number
  literatureCost: number
  mailCount: number
  mailCost: number
  yardSignsCost: number
  // Resolved fee: the BallotReady value, or DEFAULT_FILING_FEE when null.
  filingFee: number
  // True when filingFee fell back to the default (BallotReady had no number).
  filingFeeIsDefault: boolean
  subtotal: number
  contingency: number
  totalBudget: number
}

// contactGoal is the voter contact goal (win number × 5); projectedTurnout
// sizes the direct-mail universe (40% of likely voters).
export const computeBudget = (
  contactGoal: number,
  projectedTurnout: number,
  filingFee: number | null,
): BudgetComputation => {
  const textCount = Math.round(contactGoal * TEXTS_PERCENT)
  const textCost = textCount * TEXT_COST
  const robocallCount = Math.round(contactGoal * ROBOCALLS_PERCENT)
  const robocallCost = robocallCount * ROBOCALL_COST

  const doorGoal = Math.round(contactGoal * DOORS_PERCENT)
  const literaturePieces = doorGoal * LITERATURE_PIECES_PER_DOOR
  const literaturePacks = Math.ceil(literaturePieces / LITERATURE_PACK_SIZE)
  const literatureCost = literaturePacks * LITERATURE_PACK_COST

  const mailCount = Math.round(projectedTurnout * MAIL_UNIVERSE_RATE)
  const mailCost = mailCount * MAIL_COST_PER_PIECE

  const filingFeeIsDefault = filingFee == null
  const resolvedFilingFee = filingFee ?? DEFAULT_FILING_FEE

  const subtotal =
    textCost +
    robocallCost +
    literatureCost +
    mailCost +
    YARD_SIGNS_COST +
    resolvedFilingFee
  const contingency = subtotal * CONTINGENCY_RATE
  const totalBudget = Math.round(subtotal + contingency)

  return {
    textCount,
    textCost,
    robocallCount,
    robocallCost,
    doorGoal,
    literaturePieces,
    literaturePacks,
    literatureCost,
    mailCount,
    mailCost,
    yardSignsCost: YARD_SIGNS_COST,
    filingFee: resolvedFilingFee,
    filingFeeIsDefault,
    subtotal,
    contingency,
    totalBudget,
  }
}
