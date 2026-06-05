import { dateUsHelper } from 'helpers/dateHelper'
import type {
  CommunityEventsData,
  StrategicLandscapeData,
} from 'gpApi/api-endpoints'
import type { RaceCandidate, RaceMilestones } from 'helpers/types'
import {
  computeBudget,
  LITERATURE_PACK_COST,
  LITERATURE_PACK_SIZE,
  MAIL_COST_PER_PIECE,
  ROBOCALL_COST,
  TEXT_COST,
} from '../../components/budget'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

const addDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * ONE_DAY_MS)

const formatDate = (date: Date): string => dateUsHelper(date.toISOString())

const parseDateIso = (value: string | null | undefined): Date | null => {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

const formatDateMaybe = (value: string | null | undefined): string | null => {
  const d = parseDateIso(value)
  return d ? formatDate(d) : null
}

// Subset of CustomIssue/CandidateStance the plan cares about; we accept loose
// shapes here so the caller can pass campaign.details.customIssues /
// campaign.Stances straight through.
export interface PlanIssueInput {
  title?: string
  position?: string
  order?: number
}

export interface PlanStanceInput {
  issueName?: string
  statement?: string
}

export interface PlanOpponentInput {
  name?: string
  party?: string
  description?: string
}

export interface PlanInput {
  candidateName: string
  race: string
  district: string
  city: string
  state: string
  partisanType: string
  electionDateIso: string | null | undefined
  filingDateStartIso: string | null | undefined
  filingDateEndIso: string | null | undefined
  winNumber: number
  projectedTurnout: number
  voterContactGoal: number
  runningAgainst: PlanOpponentInput[]
  customIssues: PlanIssueInput[]
  stances: PlanStanceInput[]
  hubspotIncumbent: string | null
  filingFee: number | null
  filingRequirementsText: string | null
  // From raceTargetMetrics (election-api campaign-strategy-context). All
  // nullable — null when the BR race hash didn't resolve or upstream data is
  // sparse. When null, fallback heuristics kick in.
  registeredVoters: number | null
  uniqueCellphones: number | null
  uniqueLandlines: number | null
  raceCandidates: RaceCandidate[]
  // Per-category BR milestone windows. Null when election-api couldn't
  // fetch them; individual category nullable when BR has no data for it.
  // Drives Section 6 Campaign Timeline dates; falls back to E-offset
  // approximations when null.
  milestones: RaceMilestones | null
  // Strategic landscape from /campaignStrategy/mine/strategic-landscape.
  // Undefined while polling or on error; when present takes precedence over
  // raceCandidates + the legacy runningAgainst + hubspotIncumbent fallback
  // for opponents and is the only source for opportunities + challenges.
  strategicLandscape?: StrategicLandscapeData
  // Community events from /campaignStrategy/mine/community-events.
  // Undefined while polling or on error; when present overrides the
  // templated `buildCivicEvents` fallback rows. An empty events array is
  // a meaningful "ready, found nothing" state — the section renders an
  // empty state without falling back to templates.
  communityEvents?: CommunityEventsData
  // Press outlets from GET /v1/onboarding/local-news. Same semantics as
  // communityEvents — undefined while polling or on error, real array
  // (possibly empty) when ready. Falls back to `buildPressOutlets`
  // templated rows when undefined.
  pressOutletsFromApi?: ApiPressOutlet[]
  // Top voter issues from GET /v1/onboarding/voter-issues. Already fetched
  // in an earlier onboarding step (TopVoterIssuesSection), so we read it
  // from the React Query cache rather than refetching. Undefined when the
  // cache miss happens (e.g. direct nav to success without going through
  // onboarding) — buildVoterInsights then falls through to candidate
  // customIssues/stances and finally the stub.
  voterIssuesFromApi?: ApiVoterIssue[]
}

// Subset of the GET /v1/onboarding/voter-issues response shape. Matches
// the on-screen TopVoterIssuesSection consumer.
export interface ApiVoterIssue {
  label: string
  score: number
  priority: 'high' | 'medium' | 'low'
}

// Subset of the GET /v1/onboarding/local-news outlet shape we render.
// Kept loose (all contact fields nullable) so callers don't have to
// pre-normalize.
export interface ApiPressOutlet {
  name: string
  type: 'TV' | 'print' | 'radio'
  description: string
  email?: string | null
  phone?: string | null
  address?: string | null
}

export interface KeyTarget {
  metric: string
  target: string
}

export interface KeyDate {
  date: string
  description: string
}

export interface TimelineRow {
  date: string
  milestone: string
  notes: string
}

export interface MetricRow {
  metric: string
  target: string
  source: string
}

export interface BudgetRow {
  category: string
  amount: string
  rationale: string
}

export interface TimeRow {
  category: string
  amount: string
  rationale: string
}

export interface FundraisingRow {
  source: string
  share: string
}

export interface CivicEvent {
  event: string
  address: string
  date: string
  why: string
}

export interface PressOutlet {
  outlet: string
  type: string
  angle: string
  contact: string
}

export interface ContactSend {
  date: string
  tactic: string
  purpose: string
}

export interface DataSourceRow {
  metric: string
  source: string
  lastUpdated: string
}

export interface ConfidenceRow {
  estimate: string
  pointValue: string
  range: string
  notes: string
}

export interface GlossaryRow {
  term: string
  definition: string
}

// Mirrors `StrategicLandscapeOpponent` from gp-api. Who is running: name,
// party, incumbency. Narrative profiling (summary, key facts, websites) isn't
// part of this section.
export interface Opponent {
  fullName: string
  partyAffiliation: string
  incumbent: boolean | null
}

export interface VoterInsightIssue {
  title: string
  description: string
}

export type ElectionType = 'partisan' | 'nonpartisan' | 'unknown'

export interface PlanData {
  candidateName: string
  race: string
  location: string
  districtName: string
  hasDistrict: boolean
  electionType: ElectionType
  electionDate: string
  electionDateRaw: Date | null
  planGenerationDate: string
  contactWindowStart: string

  winNumber: number
  winNumberLow: number
  winNumberHigh: number
  projectedTurnout: number
  projectedTurnoutLow: number
  projectedTurnoutHigh: number
  registeredVoters: number
  registeredVotersLow: number
  registeredVotersHigh: number
  voterContactGoal: number

  opponentCount: number
  volunteerHourTarget: number
  totalBudget: number
  averageTouchesPerVoter: number
  eventCount: number
  mediaCount: number

  candidateHoursPerWeek: number
  volunteerHoursPerWeek: number
  weeksRemaining: number
  filingDateStart: string | null
  filingDateEnd: string | null
  filingDeadline: string | null

  planAtAGlance: { title: string; body: string }[]
  keyCampaignTargets: KeyTarget[]
  keyDates: KeyDate[]

  voterInsightsIssues: VoterInsightIssue[]
  voterInsightsSource: 'district' | 'candidate' | 'stub'

  opportunities: string[]
  challenges: string[]
  opponents: Opponent[]
  incumbent: Opponent | null

  metrics: MetricRow[]

  timeline: TimelineRow[]

  budgetLineItems: BudgetRow[]
  timeBreakdown: TimeRow[]
  totalCampaignHours: number
  fundraisingMix: FundraisingRow[]

  civicEvents: CivicEvent[]
  pressOutlets: PressOutlet[]

  contactSchedule: ContactSend[]

  dataSources: DataSourceRow[]
  keyAssumptions: string[]
  confidenceEstimates: ConfidenceRow[]
  planDoesNotDo: string[]

  glossary: GlossaryRow[]

  filingFee: number | null
  filingRequirementsText: string | null
}


const buildTimeline = (
  electionDate: Date | null,
  filingDateStart: Date | null,
  filingDateEnd: Date | null,
  milestones: RaceMilestones | null,
  eventCount: number,
): {
  timeline: TimelineRow[]
  keyDates: KeyDate[]
} => {
  if (!electionDate) {
    return { timeline: [], keyDates: [] }
  }

  // Row order, copy, and source mapping per ClickUp Campaign Plan
  // Template § 6 (2026-05-30):
  //   1. filing_end_date           — Nomination papers filed
  //   2. EARLY_VOTING.OPEN         — Early voting begins
  //   3. EARLY_VOTING.CLOSE        — Early voting ends
  //   4. REQUEST_BALLOT.OPEN       — Absentee ballot request opens
  //   5. REGISTRATION.OPEN         — Voter registration opens
  //   6. REGISTRATION.CLOSE        — Voter registration deadline
  //   7. REQUEST_BALLOT.CLOSE      — Absentee ballot request deadline
  //   8. VOTING.CLOSE              — Election Day
  //
  // Source priority per row: real BR milestone date if present (>90% fill
  // rate per Nigel's screenshot), else E-offset approximation. Notes
  // column flags which one is in play so the candidate knows.
  const filing = filingDateEnd ?? filingDateStart ?? addDays(electionDate, -40)
  const filingIsReal = filingDateEnd != null
  const earlyVotingStart =
    parseDateIso(milestones?.early_voting?.start ?? null) ??
    addDays(electionDate, -14)
  const earlyVotingStartIsReal = milestones?.early_voting?.start != null
  const earlyVotingEnd =
    parseDateIso(milestones?.early_voting?.end ?? null) ??
    addDays(electionDate, -2)
  const earlyVotingEndIsReal = milestones?.early_voting?.end != null
  const requestBallotStart =
    parseDateIso(milestones?.request_ballot?.start ?? null) ??
    addDays(electionDate, -45)
  const requestBallotStartIsReal = milestones?.request_ballot?.start != null
  const voterRegOpen = parseDateIso(
    milestones?.voter_registration?.start ?? null,
  )
  const voterRegDeadline =
    parseDateIso(milestones?.voter_registration?.end ?? null) ??
    addDays(electionDate, -15)
  const voterRegDeadlineIsReal = milestones?.voter_registration?.end != null
  const requestBallotEnd =
    parseDateIso(milestones?.request_ballot?.end ?? null) ??
    addDays(electionDate, -7)
  const requestBallotEndIsReal = milestones?.request_ballot?.end != null

  const sourceNote = (isReal: boolean, baseNote: string): string =>
    isReal ? `Per BallotReady. ${baseNote}` : `Approximate. ${baseNote}`

  const timelineRows: Array<{ date: Date; milestone: string; notes: string }> =
    [
      {
        date: filing,
        milestone: 'Nomination papers filed with Town Clerk',
        notes: filingIsReal
          ? 'Filing deadline per BallotReady. Bring two backup copies.'
          : 'Bring two backup copies.',
      },
      {
        date: earlyVotingStart,
        milestone: 'Early voting begins',
        notes: sourceNote(
          earlyVotingStartIsReal,
          'Persuasion contact should be wrapping up.',
        ),
      },
      {
        date: earlyVotingEnd,
        milestone: 'Early voting ends',
        notes: sourceNote(
          earlyVotingEndIsReal,
          'Last day for in-person early voting in most jurisdictions.',
        ),
      },
      {
        date: requestBallotStart,
        milestone: 'Absentee ballot request opens',
        notes: sourceNote(
          requestBallotStartIsReal,
          'Plan introduction text and robocall campaigns to land before this date.',
        ),
      },
      // REGISTRATION.OPEN is the only row with no good E-offset fallback —
      // registration is year-round in most states. Show only when BR has a
      // real date so we don't render an invented one.
      ...(voterRegOpen
        ? [
            {
              date: voterRegOpen,
              milestone: 'Voter registration opens',
              notes: 'Per BallotReady.',
            },
          ]
        : []),
      {
        date: voterRegDeadline,
        milestone: 'Voter registration deadline',
        notes: sourceNote(
          voterRegDeadlineIsReal,
          'Push via robocall campaign.',
        ),
      },
      {
        date: requestBallotEnd,
        milestone: 'Absentee ballot request deadline',
        notes: sourceNote(requestBallotEndIsReal, 'Push via text campaign.'),
      },
      {
        date: electionDate,
        milestone: 'Election Day, polls open; absentee ballots due',
        notes: 'All hands on deck; push via GOTV text and robocall campaigns.',
      },
    ]

  const timeline: TimelineRow[] = timelineRows
    .slice()
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((r) => ({
      date: formatDate(r.date),
      milestone: r.milestone,
      notes: r.notes,
    }))

  const keyDateRows: Array<{ date: Date; description: string }> = [
    {
      date: filing,
      description: 'Nomination papers filed with Town Clerk.',
    },
    {
      date: requestBallotStart,
      description:
        'Absentee / mail ballot requests open. First voter contact must land by this date.',
    },
    {
      date: addDays(electionDate, -20),
      description:
        eventCount > 0
          ? `${eventCount} community event${
              eventCount === 1 ? '' : 's'
            } that you should personally attend.`
          : 'Identify community events in your area to attend in person.',
    },
    {
      date: voterRegDeadline,
      description: 'Voter registration deadline.',
    },
    {
      date: requestBallotEnd,
      description: 'Absentee ballot request deadline.',
    },
    {
      date: electionDate,
      description: 'Election Day.',
    },
  ]

  const keyDates: KeyDate[] = keyDateRows
    .slice()
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((r) => ({
      date: formatDate(r.date),
      description: r.description,
    }))

  return { timeline, keyDates }
}

const buildContactSchedule = (electionDate: Date | null): ContactSend[] => {
  if (!electionDate) return []
  const sends: { offset: number; data: Omit<ContactSend, 'date'> }[] = [
    {
      offset: -56,
      data: {
        tactic: 'Text',
        purpose: 'Introduce yourself to voters with cellphones.',
      },
    },
    {
      offset: -49,
      data: {
        tactic: 'Robocall',
        purpose: 'Introduce yourself to voters with landlines.',
      },
    },
    {
      offset: -35,
      data: {
        tactic: 'Text',
        purpose:
          'Build trust and persuade voters with cellphones to vote for you.',
      },
    },
    {
      offset: -28,
      data: {
        tactic: 'Robocall',
        purpose:
          'Build trust and persuade voters with landlines to vote for you.',
      },
    },
    {
      offset: -14,
      data: {
        tactic: 'Text',
        purpose: 'Encourage voters with cellphones to vote early.',
      },
    },
    {
      offset: -1,
      data: {
        tactic: 'Robocall',
        purpose: 'Get out the vote on election day.',
      },
    },
    {
      offset: 0,
      data: {
        tactic: 'Text',
        purpose: 'Get out the vote on election day.',
      },
    },
  ]

  return sends.map(({ offset, data }) => ({
    date: formatDate(addDays(electionDate, offset)),
    ...data,
  }))
}

const buildCivicEvents = (
  communityEvents: CommunityEventsData | undefined,
): CivicEvent[] => {
  // Only renders real LLM-sourced events. If the endpoint hasn't resolved
  // or errored, returns []; the renderer shows an empty/skeleton state
  // rather than templated rows with invented event names and dates.
  // `address` is the venue's physical street address from BR/search,
  // null when the search data had no address.
  if (!communityEvents) return []
  return communityEvents.events.map((e) => ({
    event: e.title,
    address: e.address ?? '',
    date: dateUsHelper(e.date),
    why: e.description,
  }))
}

const OUTLET_TYPE_LABEL: Record<ApiPressOutlet['type'], string> = {
  TV: 'Television',
  print: 'Print',
  radio: 'Radio',
}

const formatOutletContact = (outlet: ApiPressOutlet): string =>
  [outlet.address, outlet.phone, outlet.email]
    .filter(
      (part): part is string => typeof part === 'string' && part.length > 0,
    )
    .join('\n') || 'Contact info not yet available'

// Returns empty when the local-news endpoint hasn't resolved yet — the
// renderer shows a skeleton on the empty + generating combination so the
// user never sees stale templated rows. Mirrors the civicEvents handling.
const buildPressOutlets = (
  outletsFromApi: ApiPressOutlet[] | undefined,
): PressOutlet[] => {
  if (!outletsFromApi) return []
  return outletsFromApi.map((o) => ({
    outlet: o.name,
    type: OUTLET_TYPE_LABEL[o.type],
    // The local-news endpoint returns a one-sentence outlet description
    // ("coverage area and focus"). Use it verbatim as the pitch angle —
    // the candidate can tailor in Campaign Manager.
    angle: o.description,
    contact: formatOutletContact(o),
  }))
}


const formatDollars = (value: number): string =>
  `$${Math.round(value).toLocaleString('en-US')}`

interface BudgetBreakdown {
  totalBudget: number
  lineItems: BudgetRow[]
}

const buildBudgetBreakdown = (
  contactGoal: number,
  projectedTurnout: number,
  filingFee: number | null,
): BudgetBreakdown => {
  const budget = computeBudget(contactGoal, projectedTurnout, filingFee)

  const lineItems: BudgetRow[] = [
    {
      category: 'Text campaigns',
      amount: formatDollars(budget.textCost),
      rationale: `60% of your ${contactGoal.toLocaleString(
        'en-US',
      )} voter contacts (${budget.textCount.toLocaleString(
        'en-US',
      )} texts) at $${TEXT_COST.toFixed(3)} per text.`,
    },
    {
      category: 'Robocall campaigns',
      amount: formatDollars(budget.robocallCost),
      rationale: `20% of your ${contactGoal.toLocaleString(
        'en-US',
      )} voter contacts (${budget.robocallCount.toLocaleString(
        'en-US',
      )} calls) at $${ROBOCALL_COST.toFixed(3)} per call.`,
    },
    {
      category: 'Literature',
      amount: formatDollars(budget.literatureCost),
      rationale: `Door hanger + palm card for each of ${budget.doorGoal.toLocaleString(
        'en-US',
      )} doors — ${budget.literaturePacks.toLocaleString(
        'en-US',
      )} packs of ${LITERATURE_PACK_SIZE} at $${LITERATURE_PACK_COST} per pack.`,
    },
    {
      category: 'Direct mail',
      amount: formatDollars(budget.mailCost),
      rationale: `${budget.mailCount.toLocaleString(
        'en-US',
      )} mailers (40% of projected turnout, your likely voters) at $${MAIL_COST_PER_PIECE.toFixed(
        2,
      )} per piece.`,
    },
    {
      category: 'Yard signs',
      amount: formatDollars(budget.yardSignsCost),
      rationale: 'Flat estimate of 50 yard signs.',
    },
    {
      category: 'Filing fees',
      amount: formatDollars(budget.filingFee),
      rationale: budget.filingFeeIsDefault
        ? 'Estimated $100 default. Replaced with the BallotReady value once available.'
        : 'Sourced from BallotReady for this race.',
    },
    {
      category: 'Contingency (5%)',
      amount: formatDollars(budget.contingency),
      rationale: 'Reserve for last-week opportunities.',
    },
    {
      category: 'Total',
      amount: formatDollars(budget.totalBudget),
      rationale: 'Sum of all budget line-items.',
    },
  ]

  return { totalBudget: budget.totalBudget, lineItems }
}

const VOLUNTEERS_PER_WEEK = 45
const VOLUNTEER_HOURS_PER_SHIFT = 3
const CANDIDATE_HOURS_PER_WEEK = 14
const DOORS_PER_HOUR = 15
const MAX_CAMPAIGN_WEEKS = 12
// Share of voter contacts assumed to come from door knocking (vs. text /
// robocall). Drives both the volunteer-hour target and the per-week door
// load below.
const CANVASS_SHARE_OF_CONTACTS = 0.2

const buildTimeBreakdown = (
  weeksRemaining: number,
): { rows: TimeRow[]; totalHours: number } => {
  const candidateHours = CANDIDATE_HOURS_PER_WEEK * weeksRemaining
  const volunteerHours =
    VOLUNTEERS_PER_WEEK * VOLUNTEER_HOURS_PER_SHIFT * weeksRemaining
  const totalHours = candidateHours + volunteerHours
  const rows: TimeRow[] = [
    {
      category: 'Your time (hours)',
      amount: `${candidateHours.toLocaleString('en-US')} hours`,
      rationale: `${CANDIDATE_HOURS_PER_WEEK} hours per week knocking doors and meeting voters in person.`,
    },
    {
      category: 'Volunteer time (hours)',
      amount: `${volunteerHours.toLocaleString('en-US')} hours`,
      rationale: `${VOLUNTEERS_PER_WEEK} volunteers × ${VOLUNTEER_HOURS_PER_SHIFT}-hour shifts per week.`,
    },
    {
      category: 'Total',
      amount: `${totalHours.toLocaleString('en-US')} hours`,
      rationale: 'Sum of all time line-items.',
    },
  ]
  return { rows, totalHours }
}

const FUNDRAISING_MIX: FundraisingRow[] = [
  { source: 'Self-fund or loan', share: '30%' },
  { source: 'Friends & family', share: '30%' },
  { source: 'Small-dollar online', share: '25%' },
  { source: 'Events, house parties, larger checks', share: '15%' },
]

const KEY_ASSUMPTIONS: string[] = [
  'Turnout behaves like recent comparable off-year municipal elections in your area, roughly 18 to 24 percent of registered voters.',
  'Voter preferences distribute across the field without one opponent dominating. A plurality near 40 percent is often sufficient to win, but we plan to the more conservative 50% + 1 threshold.',
  'You will execute the contact cadence on schedule. Any slippage materially reduces the probability of hitting the contact goal.',
]

const PLAN_DOES_NOT_DO: string[] = [
  'It does not include a persuasion model. We are not scoring individual voters for likelihood of supporting you specifically, which would require survey data we do not have.',
  'It does not forecast a win probability. The race is close by design, and small shifts in turnout can flip the outcome.',
  'It does not replace local political judgment. Your own read of the community should override any single number in this document.',
]

const GLOSSARY: GlossaryRow[] = [
  {
    term: 'Registered Voters',
    definition:
      'The total pool of voters eligible to cast a ballot for a race, pulled from the latest voter file.',
  },
  {
    term: 'Projected Votes Needed to Win',
    definition:
      'The vote total at which a candidate would win the seat with certainty given the modeled voter turnout. Calculated as 50% + 1 of the projected voter turnout.',
  },
  {
    term: 'Projected Voter Turnout',
    definition:
      'The estimated number of registered voters expected to cast a ballot in this specific election, derived from a turnout model applied to recent comparable cycles. Historically our projections have been +/- 1.5% of actual voter turnout.',
  },
  {
    term: 'Targeted Voter Contact Goal',
    definition:
      'The total number of contacts sent to voters that the campaign aims to deliver. Industry rule of thumb is 5× the projected votes needed to win.',
  },
  {
    term: 'Voter Contact',
    definition:
      'A contact attempt that reaches an intended voter via a channel capable of conveying the message (delivered text, answered call, in-person conversation).',
  },
  {
    term: 'Likely Votes',
    definition:
      'The estimated number of votes you are on track to receive based on voter contacts completed to date. Calculated by counting 1 likely vote for every 5 voter contacts made.',
  },
  {
    term: 'Text',
    definition:
      'A one-to-one SMS send from a volunteer-operated dashboard that complies with federal wireless regulations around automated dialing.',
  },
  {
    term: 'Robocall',
    definition:
      'An automated pre-recorded voice call, used here only to landlines to comply with applicable wireless rules.',
  },
  {
    term: 'Match Rate',
    definition:
      'The share of records in a voter file that are successfully appended with a phone number from a commercial data vendor.',
  },
  {
    term: 'Standard Error / 95% CI',
    definition:
      'A range around an estimate such that, under the modeling assumptions, the true value is expected to fall within the range 95% of the time.',
  },
  {
    term: 'GOTV',
    definition:
      '"Get Out The Vote", the concentrated push in the final 72 hours to convert identified supporters into cast ballots.',
  },
]

const buildPlanAtAGlance = (
  projectedTurnout: number,
  contactWindowStart: string,
  electionDate: string,
  eventCount: number,
): { title: string; body: string }[] => [
  {
    title: 'Voter turnout is the ball game.',
    body: `In a ${projectedTurnout.toLocaleString(
      'en-US',
    )}-group of targeted voters with no party label to lean on, repeated name exposure and getting your people to the polls are the decisive levers.`,
  },
  {
    title: 'Stack the channels.',
    body: `7 coordinated voter contacts (text + robocall) blanket your targeted voters between ${
      contactWindowStart || '{12_weeks_before_election_date}'
    } and ${electionDate || '{election_date}'}.`,
  },
  {
    title: 'Show up in person.',
    body:
      eventCount > 0
        ? `${eventCount} high-density community event${
            eventCount === 1 ? '' : 's'
          } during your campaign carry more weight per hour than any paid channel.`
        : 'Attending community events in person carries more weight per hour than any paid channel.',
  },
  {
    title: 'Message discipline.',
    body: 'Define your core values and top issues that matter to you and your voters and stay consistent in how you communicate them.',
  },
]

const buildOpponents = (
  strategicLandscape: StrategicLandscapeData | undefined,
  raceCandidates: RaceCandidate[],
  runningAgainst: PlanOpponentInput[],
  hubspotIncumbentName: string | null,
): Opponent[] => {
  // Source priority:
  //   1. strategicLandscape — the CAP endpoint's opponent roster.
  //   2. raceCandidates — BR/election-api filings via raceTargetMetrics.
  //      Authoritative for who's on the ballot + incumbent flag.
  //   3. runningAgainst — user-entered onboarding answers.
  //   4. hubspotIncumbent — last-ditch incumbent name from HubSpot.
  if (strategicLandscape?.opponents.length) {
    return strategicLandscape.opponents.map((o) => ({
      fullName: o.fullName,
      partyAffiliation: o.partyAffiliation,
      incumbent: o.incumbent,
    }))
  }
  const fromRaceCandidates: Opponent[] = raceCandidates
    .filter((c) => c.fullName.trim() !== '')
    .map((c) => ({
      fullName: c.fullName.trim(),
      partyAffiliation: c.party?.trim() ?? '',
      incumbent: c.isIncumbent,
    }))
  if (fromRaceCandidates.length > 0) return fromRaceCandidates
  const fromRunningAgainst: Opponent[] = runningAgainst
    .filter((o) => (o.name ?? '').trim() !== '')
    .map((o) => ({
      fullName: o.name?.trim() ?? '',
      partyAffiliation: o.party?.trim() ?? '',
      incumbent: false,
    }))
  if (fromRunningAgainst.length > 0) return fromRunningAgainst
  if (hubspotIncumbentName && hubspotIncumbentName.trim() !== '') {
    return [
      {
        fullName: hubspotIncumbentName.trim(),
        partyAffiliation: '',
        incumbent: true,
      },
    ]
  }
  return []
}

const PRIORITY_PHRASE: Record<'high' | 'medium' | 'low', string> = {
  high: 'top-priority',
  medium: 'mid-priority',
  low: 'lower-priority',
}

const describeApiIssue = (issue: ApiVoterIssue): string => {
  const score = Math.round(issue.score)
  return `Ranks as a ${
    PRIORITY_PHRASE[issue.priority]
  } concern for voters in this district — about ${score}% identify it among their top issues.`
}

const buildVoterInsights = (
  customIssues: PlanIssueInput[],
  stances: PlanStanceInput[],
  voterIssuesFromApi: ApiVoterIssue[] | undefined,
): {
  issues: VoterInsightIssue[]
  source: 'district' | 'candidate' | 'stub'
} => {
  // Prefer real district survey data when the cached query resolved. The
  // on-screen TopVoterIssuesSection in onboarding shows the same labels;
  // synthesizing a short description here keeps the PDF's title+body
  // DefinitionList shape intact without forcing the API to add copy.
  if (voterIssuesFromApi && voterIssuesFromApi.length > 0) {
    return {
      issues: voterIssuesFromApi.map((i) => ({
        title: i.label,
        description: describeApiIssue(i),
      })),
      source: 'district',
    }
  }
  const fromCustom = customIssues
    .filter((i) => (i.title ?? '').trim() !== '')
    .map((i) => ({
      title: (i.title ?? '').trim(),
      description: (i.position ?? '').trim(),
    }))
  if (fromCustom.length > 0) {
    return { issues: fromCustom, source: 'candidate' }
  }
  const fromStances = stances
    .filter((s) => (s.issueName ?? '').trim() !== '')
    .map((s) => ({
      title: (s.issueName ?? '').trim(),
      description: (s.statement ?? '').trim(),
    }))
  if (fromStances.length > 0) {
    return { issues: fromStances, source: 'candidate' }
  }
  return {
    issues: [
      {
        title: 'Cost of living and local services',
        description:
          'Survey and voter data point to housing, services, and local tax pressure as the most common top concerns in this district.',
      },
      {
        title: 'Public safety and community trust',
        description:
          'Voters consistently rank safety, response times, and the quality of community-police relationships among their top issues.',
      },
      {
        title: 'Schools and youth programs',
        description:
          'Education funding, after-school programs, and youth services drive turnout among the most reliable voters in races at this level.',
      },
    ],
    source: 'stub',
  }
}

const DATA_SOURCES: DataSourceRow[] = [
  {
    metric: 'Registered voters in your district',
    source: 'L2 Voter Data',
    lastUpdated: 'Refreshed monthly',
  },
  {
    metric: 'Historical turnout',
    source: 'Official Election Results',
    lastUpdated: 'As of last 3 certified elections',
  },
  {
    metric: 'Phone match rates',
    source: 'Match between voter information and commercial data',
    lastUpdated: 'Rolling 90-day refresh',
  },
  {
    metric: 'Candidate-field data (opponents, seats)',
    source: 'BallotReady candidate filings',
    lastUpdated: 'As of filing deadline',
  },
  {
    metric: 'Filing fee & requirements',
    source: 'BallotReady recruitment data, parsed by election-api',
    lastUpdated: 'Rolling',
  },
  {
    metric: 'Press and media outlets',
    source: 'GoodParty.org local-media directory',
    lastUpdated: 'Rolling',
  },
]

const buildConfidenceEstimates = (
  registeredVoters: number,
  registeredVotersLow: number,
  registeredVotersHigh: number,
  projectedTurnout: number,
  projectedTurnoutLow: number,
  projectedTurnoutHigh: number,
  winNumber: number,
  winNumberLow: number,
  winNumberHigh: number,
): ConfidenceRow[] => [
  {
    estimate: 'Registered voters',
    pointValue: registeredVoters.toLocaleString('en-US'),
    range: `${registeredVotersLow.toLocaleString(
      'en-US',
    )}–${registeredVotersHigh.toLocaleString('en-US')}`,
    notes: 'Based on the latest voter file for your district.',
  },
  {
    estimate: 'Projected voter turnout',
    pointValue: projectedTurnout.toLocaleString('en-US'),
    range: `${projectedTurnoutLow.toLocaleString(
      'en-US',
    )}–${projectedTurnoutHigh.toLocaleString('en-US')}`,
    notes: 'Based on 3-cycle turnout average.',
  },
  {
    estimate: 'Projected votes needed to win',
    pointValue: winNumber.toLocaleString('en-US'),
    range: `${winNumberLow.toLocaleString(
      'en-US',
    )}–${winNumberHigh.toLocaleString('en-US')}`,
    notes: 'Moves with the targeted voters.',
  },
]

const resolveElectionType = (partisanType: string): ElectionType => {
  const t = partisanType.trim().toLowerCase()
  if (t === 'partisan') return 'partisan'
  if (t === 'nonpartisan' || t === 'non-partisan') return 'nonpartisan'
  return 'unknown'
}

export const buildPlanData = (input: PlanInput): PlanData => {
  const candidateName = input.candidateName || 'Your campaign'
  const race = input.race || 'Your race'
  const location = [input.city, input.state].filter(Boolean).join(', ')
  const districtName = (input.district ?? '').trim()
  const hasDistrict = districtName !== ''
  const electionType = resolveElectionType(input.partisanType ?? '')

  const electionDateValid = parseDateIso(input.electionDateIso)
  const electionDate = electionDateValid ? formatDate(electionDateValid) : ''
  const filingDateStart = parseDateIso(input.filingDateStartIso)
  const filingDateEnd = parseDateIso(input.filingDateEndIso)
  const contactWindowStart = electionDateValid
    ? formatDate(addDays(electionDateValid, -84))
    : ''

  const planGenerationDate = formatDate(new Date())

  const winNumber = input.winNumber
  const projectedTurnout = input.projectedTurnout
  const voterContactGoal =
    input.voterContactGoal > 0
      ? input.voterContactGoal
      : Math.round(winNumber * 5)

  const winNumberLow = Math.max(0, Math.round(winNumber * 0.9))
  const winNumberHigh = Math.round(winNumber * 1.1)
  const projectedTurnoutLow = Math.max(0, Math.round(projectedTurnout * 0.9))
  const projectedTurnoutHigh = Math.round(projectedTurnout * 1.1)

  // Prefer the real registered-voter count from election-api when present.
  // Falls back to the ~22%-turnout heuristic on projectedTurnout when the
  // race hash didn't resolve or upstream data is sparse.
  const registeredVoters =
    input.registeredVoters && input.registeredVoters > 0
      ? input.registeredVoters
      : projectedTurnout > 0
        ? Math.round(projectedTurnout / 0.22)
        : 0
  const registeredVotersLow = Math.max(0, Math.round(registeredVoters * 0.9))
  const registeredVotersHigh = Math.round(registeredVoters * 1.1)

  const averageTouchesPerVoter =
    projectedTurnout > 0
      ? Number((voterContactGoal / projectedTurnout).toFixed(1))
      : 0

  const { totalBudget, lineItems: budgetLineItems } = buildBudgetBreakdown(
    voterContactGoal,
    projectedTurnout,
    input.filingFee,
  )

  let weeksRemaining = MAX_CAMPAIGN_WEEKS
  if (electionDateValid) {
    const ms = electionDateValid.getTime() - Date.now()
    if (ms > 0) {
      weeksRemaining = Math.min(
        Math.ceil(ms / (7 * 24 * 60 * 60 * 1000)),
        MAX_CAMPAIGN_WEEKS,
      )
    }
  }

  // Volunteer-only portion of the Section 5 time budget — matches the
  // "Volunteer time" row of buildTimeBreakdown. Excludes the candidate's
  // own hours so the figure on the Key Targets table reconciles with the
  // volunteer line in the Section 5 table.
  const volunteerHourTarget =
    VOLUNTEERS_PER_WEEK * VOLUNTEER_HOURS_PER_SHIFT * weeksRemaining
  const totalDoors = Math.round(voterContactGoal * CANVASS_SHARE_OF_CONTACTS)
  const doorsPerWeek = totalDoors / weeksRemaining
  const candidateDoorsPerWeek = CANDIDATE_HOURS_PER_WEEK * DOORS_PER_HOUR
  const volunteerDoorsPerWeek = Math.max(
    0,
    doorsPerWeek - candidateDoorsPerWeek,
  )
  const volunteerHoursPerWeek = Math.round(
    volunteerDoorsPerWeek / DOORS_PER_HOUR,
  )

  const { rows: timeBreakdown, totalHours: totalCampaignHours } =
    buildTimeBreakdown(weeksRemaining)

  // civicEvents must be computed before buildTimeline so the Section 6
  // keyDates entry can substitute the actual event count instead of a
  // raw `{N}` placeholder. pressOutlets has no such dependency but is
  // grouped here with civicEvents for clarity.
  const civicEvents = buildCivicEvents(input.communityEvents)
  const pressOutlets = buildPressOutlets(input.pressOutletsFromApi)
  const eventCount = civicEvents.length
  const mediaCount = pressOutlets.length

  const { timeline, keyDates } = buildTimeline(
    electionDateValid,
    filingDateStart,
    filingDateEnd,
    input.milestones,
    eventCount,
  )
  const contactSchedule = buildContactSchedule(electionDateValid)

  const confidenceEstimates = buildConfidenceEstimates(
    registeredVoters,
    registeredVotersLow,
    registeredVotersHigh,
    projectedTurnout,
    projectedTurnoutLow,
    projectedTurnoutHigh,
    winNumber,
    winNumberLow,
    winNumberHigh,
  )
  const planAtAGlance = buildPlanAtAGlance(
    projectedTurnout,
    contactWindowStart,
    electionDate,
    eventCount,
  )

  const opponents = buildOpponents(
    input.strategicLandscape,
    input.raceCandidates,
    input.runningAgainst,
    input.hubspotIncumbent,
  )
  const opponentCount = opponents.length
  const incumbent = opponents.find((o) => o.incumbent === true) ?? null

  const { issues: voterInsightsIssues, source: voterInsightsSource } =
    buildVoterInsights(
      input.customIssues,
      input.stances,
      input.voterIssuesFromApi,
    )

  const keyCampaignTargets: KeyTarget[] = [
    {
      metric: 'Projected Votes Needed to Win',
      target: winNumber.toLocaleString('en-US'),
    },
    {
      metric: 'Projected Voter Turnout',
      target: projectedTurnout.toLocaleString('en-US'),
    },
    {
      metric: 'Targeted Voter Contact Goal',
      target: voterContactGoal.toLocaleString('en-US'),
    },
    {
      metric: 'Recommended Budget',
      target: `$${totalBudget.toLocaleString('en-US')}`,
    },
    {
      metric: 'Volunteer-Hour Goal',
      target: `${volunteerHourTarget.toLocaleString('en-US')}+`,
    },
  ]

  const metrics: MetricRow[] = [
    {
      metric: 'Registered Voters',
      target: `${registeredVoters.toLocaleString('en-US')} registered voters`,
      source:
        'The total pool of voters eligible to cast a ballot in your race, pulled from the latest voter file.',
    },
    {
      metric: 'Projected Voter Turnout',
      target: `${projectedTurnout.toLocaleString('en-US')} voters turnout`,
      source:
        'The projected number of voters we expect to cast a ballot in your race, based on past voter turnout and our proprietary models.',
    },
    {
      metric: 'Projected Votes Needed to Win',
      target: `${winNumber.toLocaleString('en-US')} votes needed to win`,
      source:
        'Projecting a simple majority (50% + 1) of projected voter turnout.',
    },
    {
      metric: 'Contacts Per Likely Voter',
      target: '5 contacts per likely voter',
      source: 'Industry standard number of contacts for winning campaigns.',
    },
    {
      metric: 'Voter Contact Target',
      target: `${voterContactGoal.toLocaleString(
        'en-US',
      )} total voter contacts`,
      source: 'Voter Contacts × Votes Needed to Win.',
    },
    {
      metric: 'Volunteer-Hour Target',
      target: `${volunteerHourTarget.toLocaleString('en-US')} volunteer hours`,
      source: `${VOLUNTEERS_PER_WEEK} volunteers × ${VOLUNTEER_HOURS_PER_SHIFT}-hour shift per week × ${weeksRemaining} weeks of campaigning.`,
    },
  ]

  return {
    candidateName,
    race,
    location,
    districtName,
    hasDistrict,
    electionType,
    electionDate,
    electionDateRaw: electionDateValid,
    planGenerationDate,
    contactWindowStart,
    winNumber,
    winNumberLow,
    winNumberHigh,
    projectedTurnout,
    projectedTurnoutLow,
    projectedTurnoutHigh,
    registeredVoters,
    registeredVotersLow,
    registeredVotersHigh,
    voterContactGoal,
    opponentCount,
    volunteerHourTarget,
    totalBudget,
    averageTouchesPerVoter,
    eventCount,
    mediaCount,
    candidateHoursPerWeek: CANDIDATE_HOURS_PER_WEEK,
    volunteerHoursPerWeek,
    weeksRemaining,
    filingDateStart: formatDateMaybe(input.filingDateStartIso),
    filingDateEnd: formatDateMaybe(input.filingDateEndIso),
    filingDeadline: formatDateMaybe(input.filingDateEndIso),
    planAtAGlance,
    keyCampaignTargets,
    keyDates,
    voterInsightsIssues,
    voterInsightsSource,
    // Strategy data overrides — empty arrays while polling / on error, so
    // Section 2 should suppress its render in those cases (see PlanSections).
    opportunities: input.strategicLandscape?.opportunities ?? [],
    challenges: input.strategicLandscape?.challenges ?? [],
    opponents,
    incumbent,
    metrics,
    timeline,
    budgetLineItems,
    timeBreakdown,
    totalCampaignHours,
    fundraisingMix: FUNDRAISING_MIX,
    civicEvents,
    pressOutlets,
    contactSchedule,
    dataSources: DATA_SOURCES,
    keyAssumptions: KEY_ASSUMPTIONS,
    confidenceEstimates,
    planDoesNotDo: PLAN_DOES_NOT_DO,
    glossary: GLOSSARY,
    filingFee: input.filingFee,
    filingRequirementsText: input.filingRequirementsText,
  }
}
