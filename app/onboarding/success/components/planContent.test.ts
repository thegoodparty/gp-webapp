import { describe, expect, it } from 'vitest'
import { buildPlanData, type PlanInput } from './planContent'

// Minimum-viable PlanInput fixture. Tests override only the fields under
// test (state, milestones). Election date is fixed at a known Tue in the
// future so date math is stable.
const ELECTION_DATE_ISO = '2026-11-03'

const makeInput = (overrides: Partial<PlanInput> = {}): PlanInput => ({
  candidateName: 'Test Candidate',
  race: 'Test Office',
  district: '',
  city: '',
  state: 'CA',
  partisanType: 'nonpartisan',
  electionDateIso: ELECTION_DATE_ISO,
  filingDateStartIso: '2026-07-01',
  filingDateEndIso: '2026-08-07',
  winNumber: 1000,
  projectedTurnout: 2000,
  voterContactGoal: 5000,
  runningAgainst: [],
  customIssues: [],
  stances: [],
  hubspotIncumbent: null,
  filingFee: null,
  filingRequirementsText: null,
  registeredVoters: null,
  uniqueCellphones: null,
  uniqueLandlines: null,
  raceCandidates: [],
  milestones: null,
  ...overrides,
})

describe('buildPlanData voter-registration deadline — no-deadline states', () => {
  const NO_DEADLINE_COPY =
    'There is no registration deadline as there is same day voting.'

  it('renders the no-deadline copy for ND (no voter registration at all)', () => {
    const plan = buildPlanData(makeInput({ state: 'ND' }))

    // The standard "deadline" milestone label must NOT appear (the row
    // has been replaced with the explanatory copy keyed to Election Day).
    expect(
      plan.timeline.some(
        (row) => row.milestone === 'Voter registration deadline',
      ),
    ).toBe(false)
    const regRow = plan.timeline.find(
      (row) => row.milestone === 'Voter registration',
    )
    expect(regRow).toBeDefined()
    expect(regRow?.notes).toBe(NO_DEADLINE_COPY)

    expect(
      plan.keyDates.some((d) =>
        d.description.startsWith('Voter registration deadline'),
      ),
    ).toBe(false)
    expect(plan.keyDates.some((d) => d.description === NO_DEADLINE_COPY)).toBe(
      true,
    )
  })

  it('renders the no-deadline copy for VT (same-day registration through ED) and also suppresses the absentee row (VT is universal VBM)', () => {
    const plan = buildPlanData(makeInput({ state: 'VT' }))

    expect(
      plan.timeline.some(
        (row) => row.milestone === 'Voter registration deadline',
      ),
    ).toBe(false)
    const regRow = plan.timeline.find(
      (row) => row.milestone === 'Voter registration',
    )
    expect(regRow).toBeDefined()
    // VT's tier note is "Online ED; Mail ED; In-person ED" — redundant
    // with the same-day-voting sentence, so it should NOT be appended.
    expect(regRow?.notes).toBe(NO_DEADLINE_COPY)
    expect(plan.keyDates.some((d) => d.description === NO_DEADLINE_COPY)).toBe(
      true,
    )

    // VT is the only state that hits BOTH `voterRegHasNoDeadline` and
    // `absenteeOmitted` (universal VBM). Without this assertion a
    // regression on the absentee suppression branch for VT-shaped data
    // would slip through unnoticed.
    expect(
      plan.timeline.some(
        (row) => row.milestone === 'Absentee ballot request deadline',
      ),
    ).toBe(false)
    expect(
      plan.keyDates.some((d) =>
        d.description.startsWith('Absentee ballot request deadline'),
      ),
    ).toBe(false)
  })

  it('appends the local pre-registration tier note for NH', () => {
    const plan = buildPlanData(makeInput({ state: 'NH' }))

    const regRow = plan.timeline.find(
      (row) => row.milestone === 'Voter registration',
    )
    expect(regRow).toBeDefined()
    // NH has a meaningful tier note (locally-set deadlines) — the
    // pre-registration context should be surfaced after the
    // same-day-voting sentence rather than silently dropped.
    expect(regRow?.notes).toContain(NO_DEADLINE_COPY)
    expect(regRow?.notes).toContain('Local pre-registration')
    expect(regRow?.notes).toContain('Set locally')
  })
})

describe('buildPlanData absentee-request deadline omission', () => {
  it('omits the absentee request deadline for universal-VBM states (CA)', () => {
    const plan = buildPlanData(makeInput({ state: 'CA' }))

    expect(
      plan.timeline.some(
        (row) => row.milestone === 'Absentee ballot request deadline',
      ),
    ).toBe(false)
    expect(
      plan.keyDates.some((d) =>
        d.description.startsWith('Absentee ballot request deadline'),
      ),
    ).toBe(false)
  })

  it('uses the curated CA voter registration date (Oct 19) and ignores a conflicting BR milestone (Nov 2)', () => {
    // The real-world regression this guards: BR returned Nov 2 for CA
    // registration; the curated table has the correct Oct 19. Passing
    // the wrong BR value here proves the curated lookup wins — without
    // the conflicting BR value the E-offset fallback (electionDate-15 =
    // Oct 19) would produce the same date and the test would be
    // tautological.
    const plan = buildPlanData(
      makeInput({
        state: 'CA',
        milestones: {
          voter_registration: { start: null, end: '2026-11-02' },
          early_voting: null,
          request_ballot: null,
        },
      }),
    )

    const regRow = plan.timeline.find(
      (row) => row.milestone === 'Voter registration deadline',
    )
    expect(regRow).toBeDefined()
    expect(regRow?.date).toContain('Oct 19, 2026')
    expect(regRow?.date).not.toContain('Nov 2, 2026')
    expect(regRow?.notes).toContain('Per state SOS data')
  })
})

describe('buildPlanData tier-note rendering', () => {
  it('renders the curated tier-note in the absentee row notes for AK', () => {
    const plan = buildPlanData(makeInput({ state: 'AK' }))

    const absenteeRow = plan.timeline.find(
      (row) => row.milestone === 'Absentee ballot request deadline',
    )
    expect(absenteeRow).toBeDefined()
    expect(absenteeRow?.notes).toContain('Per state SOS data')
    expect(absenteeRow?.notes).toContain(
      'Method differences — Online Oct 19; Mail Oct 24',
    )
  })
})

describe('buildPlanData fallback for unknown state', () => {
  it('renders both deadline rows using the E-offset fallback when the state is not in the curated table', () => {
    // 'XX' is intentionally not in VOTER_DEADLINES_2026. The curated
    // lookup should miss and both rows should fall back to the
    // BR/E-offset path that previously drove everything.
    const plan = buildPlanData(makeInput({ state: 'XX' }))

    const regRow = plan.timeline.find(
      (row) => row.milestone === 'Voter registration deadline',
    )
    const absenteeRow = plan.timeline.find(
      (row) => row.milestone === 'Absentee ballot request deadline',
    )

    expect(regRow).toBeDefined()
    expect(absenteeRow).toBeDefined()
    // E-offset fallback notes start with "Approximate." (no BR milestone
    // data passed in this test). The point is just that neither row is
    // suppressed and neither claims SOS data attribution.
    expect(regRow?.notes).not.toContain('Per state SOS data')
    expect(absenteeRow?.notes).not.toContain('Per state SOS data')
  })
})
