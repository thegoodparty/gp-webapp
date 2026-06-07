// Step-derivation router for the pre-payment Pro upgrade wizard.
//
// Per tech doc v2 there is no server-side wizard session: the current step is
// derived purely from canonical state (campaign.isPro, the candidate's
// filing-status answer, EIN presence, TCR filing + PIN completeness, and
// candidate-profile completeness) so a candidate who leaves and returns lands
// on the correct step. This module must stay pure and side-effect-free — it
// only reads the inputs it is handed.

export const PRO_UPGRADE_STEP = {
  VALUE_PROP: 'value-prop',
  STATUS: 'status',
  FILING_INSTRUCTIONS: 'filing-instructions',
  GUIDANCE: 'guidance',
  EIN: 'ein',
  FILING_DETAILS: 'filing-details',
  CANDIDATE_PROFILE: 'candidate-profile',
  PAYMENT: 'payment',
  SUCCESS: 'success',
} as const

export type ProUpgradeStep =
  (typeof PRO_UPGRADE_STEP)[keyof typeof PRO_UPGRADE_STEP]

export const PRO_UPGRADE_BASE_PATH = '/dashboard/pro-upgrade'

export const proUpgradeStepPath = (step: ProUpgradeStep): string =>
  `${PRO_UPGRADE_BASE_PATH}/${step}`

// Linear forward-navigation order for the wizard shell's Back/Next controls.
// Every entry is a step `deriveProUpgradeStep` can actually land on, so the
// progress bar and nav stay in sync with the router.
//
// Two steps are intentionally absent:
// - `filing-instructions`: a dead-end branch off `status` (the candidate has
//   not yet filed to run), not a resumable step in the linear flow.
// - `guidance`: an interstitial with no persisted "seen" state, so the router
//   cannot derive it. TODO(task 09): insert it here once that task defines how
//   it is reached and advanced past.
export const PRO_UPGRADE_STEP_ORDER: ProUpgradeStep[] = [
  PRO_UPGRADE_STEP.VALUE_PROP,
  PRO_UPGRADE_STEP.STATUS,
  PRO_UPGRADE_STEP.EIN,
  PRO_UPGRADE_STEP.FILING_DETAILS,
  PRO_UPGRADE_STEP.CANDIDATE_PROFILE,
  PRO_UPGRADE_STEP.PAYMENT,
  PRO_UPGRADE_STEP.SUCCESS,
]

// The candidate's answer to "have you already filed to run for this office?".
// The router only needs the normalized tri-state; its caller maps the stored
// value into this. `unanswered` means the question has not been answered yet.
export type FilingStatus = 'unanswered' | 'has-filed' | 'not-filed'

// The answer is persisted as `campaign.details.hasFiledForRace` (task 07).
// This is the single mapping the wizard index (read) and the filing-status
// step (write) share, so a candidate who answered "yes" is never re-asked on
// return. An unset value (never answered) is `unanswered`.
export const filingStatusFromDetails = (
  hasFiledForRace: boolean | null | undefined,
): FilingStatus => {
  if (hasFiledForRace === true) return 'has-filed'
  if (hasFiledForRace === false) return 'not-filed'
  return 'unanswered'
}

export interface ProUpgradeStepInputs {
  isPro: boolean
  filingStatus: FilingStatus
  hasEin: boolean
  filingComplete: boolean
  profileComplete: boolean
  // Whether TCR PIN verification has happened. Not used to gate any
  // pre-payment step (PIN entry is a post-payment concern); carried here so
  // the post-payment status states (task 15) can refine the SUCCESS surface
  // without changing this contract.
  pinComplete: boolean
}

/**
 * Returns the step the candidate should land on, derived from canonical state.
 *
 * Already-Pro candidates are routed to the post-payment SUCCESS surface and
 * never back to a pre-payment step. Otherwise the first incomplete step in
 * canonical order wins, so completed prerequisites are skipped on return (e.g.
 * a candidate with a complete profile but no EIN lands on the EIN step).
 */
export const deriveProUpgradeStep = (
  inputs: ProUpgradeStepInputs,
): ProUpgradeStep => {
  const { isPro, filingStatus, hasEin, filingComplete, profileComplete } =
    inputs

  // Payment already happened — route to the post-payment surface, never back
  // to a pre-payment step. (Post-payment sub-states are refined in task 15.)
  if (isPro) return PRO_UPGRADE_STEP.SUCCESS

  // Brand-new candidate with nothing collected yet lands on the value-prop
  // intro. Any persisted progress means they are past the intro.
  const hasProgress =
    filingStatus !== 'unanswered' || hasEin || filingComplete || profileComplete
  if (!hasProgress) return PRO_UPGRADE_STEP.VALUE_PROP

  // Filing-status gate (task 07). Unanswered → ask. "Not filed" → the
  // filing-instructions dead-end (task 08); the candidate must file with their
  // election authority before the flow can advance, so we do not skip ahead.
  if (filingStatus === 'unanswered') return PRO_UPGRADE_STEP.STATUS
  if (filingStatus === 'not-filed') return PRO_UPGRADE_STEP.FILING_INSTRUCTIONS

  // Remaining pre-payment data steps, in canonical order; first incomplete wins.
  if (!hasEin) return PRO_UPGRADE_STEP.EIN
  if (!filingComplete) return PRO_UPGRADE_STEP.FILING_DETAILS
  if (!profileComplete) return PRO_UPGRADE_STEP.CANDIDATE_PROFILE

  // Everything collected, not yet Pro → payment.
  return PRO_UPGRADE_STEP.PAYMENT
}
