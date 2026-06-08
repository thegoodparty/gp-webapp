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
  const ND_COPY =
    'There is no registration deadline as North Dakota has no voter registration requirement.'
  const SDR_COPY =
    'There is no registration deadline as there is same day voting.'

  it('renders the ND-specific copy (no registration requirement, not same-day registration)', () => {
    const plan = buildPlanData(makeInput({ state: 'ND' }))

    expect(
      plan.timeline.some(
        (row) => row.milestone === 'Voter registration deadline',
      ),
    ).toBe(false)
    const regRow = plan.timeline.find(
      (row) => row.milestone === 'Voter registration',
    )
    expect(regRow).toBeDefined()
    // ND has no voter registration system — the SDR copy would be a
    // wrong legal basis.
    expect(regRow?.notes).toBe(ND_COPY)
    expect(regRow?.notes).not.toContain('same day voting')

    expect(
      plan.keyDates.some((d) =>
        d.description.startsWith('Voter registration deadline'),
      ),
    ).toBe(false)
    expect(plan.keyDates.some((d) => d.description === ND_COPY)).toBe(true)
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
    expect(regRow?.notes).toBe(SDR_COPY)
    expect(plan.keyDates.some((d) => d.description === SDR_COPY)).toBe(true)

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
    expect(regRow?.notes).toContain(SDR_COPY)
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

  it('documents that universal-VBM absentee suppression is year-tied: CA in 2027 shows the absentee row', () => {
    // `isUniversalVbm` is logically a state characteristic, but the
    // year guard makes the curated lookup miss for non-2026-general
    // elections — so the absentee row reappears for CA/CO/HI/etc. in
    // 2027+ even though they are still universal-VBM states. The fix
    // is to separate year-agnostic state facts from the dated deadline
    // data; until then this test pins the current behavior so a
    // regression elsewhere doesn't quietly change it.
    const plan = buildPlanData(
      makeInput({ state: 'CA', electionDateIso: '2027-11-02' }),
    )

    const absenteeRow = plan.timeline.find(
      (row) => row.milestone === 'Absentee ballot request deadline',
    )
    expect(absenteeRow).toBeDefined()
    expect(absenteeRow?.notes).not.toContain('Per state SOS data')
  })

  it('does not claim SOS authority for a 2026 primary (curated table covers the Nov general only)', () => {
    // A CA June primary has year=2026 but doesn't share the November
    // deadlines. The month gate keeps it on the BR / E-offset path so
    // the wrong dates aren't labeled as SOS-verified.
    const plan = buildPlanData(
      makeInput({ state: 'CA', electionDateIso: '2026-06-02' }),
    )

    const regRow = plan.timeline.find(
      (row) => row.milestone === 'Voter registration deadline',
    )
    expect(regRow).toBeDefined()
    expect(regRow?.notes).not.toContain('Per state SOS data')
    // And the absentee row is back in play for the same reason —
    // universal-VBM suppression depends on the curated lookup, which
    // is gated to the Nov 2026 general.
    const absenteeRow = plan.timeline.find(
      (row) => row.milestone === 'Absentee ballot request deadline',
    )
    expect(absenteeRow).toBeDefined()
  })
})
