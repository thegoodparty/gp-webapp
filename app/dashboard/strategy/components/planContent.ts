import { dateUsHelper } from 'helpers/dateHelper'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

const addDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * ONE_DAY_MS)

const formatDate = (date: Date): string => dateUsHelper(date.toISOString())

export interface PlanInput {
  candidateName: string
  race: string
  city: string
  state: string
  electionDateIso: string | null | undefined
  winNumber: number
  projectedTurnout: number
  voterContactGoal: number
}

export interface KeyNumber {
  metric: string
  target: string
}

export interface TimelineRow {
  date: string
  milestone: string
  owner: string
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

export interface CivicEvent {
  event: string
  date: string
  why: string
}

export interface PressOutlet {
  outlet: string
  type: string
  angle: string
}

export interface ContactSend {
  date: string
  tactic: string
  audience: string
  purpose: string
  format: string
}

export interface KpiRow {
  kpi: string
  target: string
  cadence: string
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

export interface PlanData {
  // Identity
  candidateName: string
  race: string
  location: string
  electionDate: string
  electionDateRaw: Date | null

  // Numbers
  winNumber: number
  winNumberLow: number
  winNumberHigh: number
  projectedTurnout: number
  projectedTurnoutLow: number
  projectedTurnoutHigh: number
  voterContactGoal: number

  // Placeholder identity numbers
  opponentCount: number
  matchedCellRecords: number
  matchedLandlineRecords: number
  volunteerHourTarget: number
  totalBudget: number
  averageTouchesPerVoter: number

  // Weekly cadence targets (for plan-inputs gap analysis)
  candidateHoursPerWeek: number
  volunteerHoursPerWeek: number
  weeksRemaining: number
  filingDeadline: string | null

  // Executive summary
  strategyBullets: { title: string; body: string }[]
  keyNumbers: KeyNumber[]
  timelineHighlights: { date: string; description: string }[]
  candidateCommitments: string[]
  biggestRisks: { title: string; body: string }[]

  // Strategic landscape
  opportunities: { title: string; body: string }[]
  challenges: { title: string; body: string }[]

  // Electoral goals
  metrics: MetricRow[]

  // Campaign timeline
  timeline: TimelineRow[]

  // Budget
  budgetLineItems: BudgetRow[]
  budgetNotCovered: { title: string; body: string }[]

  // Community engagement
  civicEvents: CivicEvent[]
  pressOutlets: PressOutlet[]

  // Voter contact
  contactSchedule: ContactSend[]

  // KPIs
  kpis: KpiRow[]

  // Methodology
  dataSources: DataSourceRow[]
  keyAssumptions: string[]
  confidenceEstimates: ConfidenceRow[]
  planDoesNotDo: string[]

  // Glossary
  glossary: GlossaryRow[]
}

const FALLBACK_OPPONENT_COUNT = 2

const PLACEHOLDER_MATCH_RATE_CELL = 0.65
const PLACEHOLDER_MATCH_RATE_LANDLINE = 0.35

const placeholderCity = (city: string): string => city || 'your district'
const placeholderState = (state: string): string => state || 'your state'

const buildTimeline = (
  electionDate: Date | null,
): {
  timeline: TimelineRow[]
  highlights: { date: string; description: string }[]
} => {
  if (!electionDate) {
    return { timeline: [], highlights: [] }
  }
  const filing = addDays(electionDate, -40)
  const staffReady = addDays(electionDate, -34)
  const messagingLocked = addDays(electionDate, -27)
  const ballotsStart = addDays(electionDate, -25)
  const voterRegDeadline = addDays(electionDate, -10)
  const absenteeDeadline = addDays(electionDate, -7)

  const timeline: TimelineRow[] = [
    {
      date: formatDate(filing),
      milestone: 'Nomination papers filed with Town Clerk',
      owner: 'You. Bring two backup copies.',
    },
    {
      date: formatDate(staffReady),
      milestone: 'Staff and volunteer recruitment and training complete',
      owner: 'Campaign Manager',
    },
    {
      date: formatDate(messagingLocked),
      milestone: 'Messaging, branding, and printed materials finalized',
      owner: 'Comms Lead. Lock before first text send.',
    },
    {
      date: formatDate(ballotsStart),
      milestone: 'Absentee and mail-in ballot distribution begins',
      owner: 'Plan first contact to land by this date.',
    },
    {
      date: formatDate(voterRegDeadline),
      milestone: 'Voter registration deadline',
      owner: 'Push via first robocall and digital.',
    },
    {
      date: formatDate(absenteeDeadline),
      milestone: 'Absentee ballot request deadline',
      owner: 'Push via second P2P text.',
    },
    {
      date: formatDate(electionDate),
      milestone: 'Election Day. Polls open. Absentee ballots due.',
      owner: 'All hands. See GOTV plan.',
    },
  ]

  const highlights = [
    {
      date: formatDate(filing),
      description: 'Nomination papers filed with Town Clerk.',
    },
    {
      date: formatDate(ballotsStart),
      description:
        'Absentee and mail ballots begin distributing. First voter contact must land by this date.',
    },
    {
      date: formatDate(voterRegDeadline),
      description: 'Voter registration deadline.',
    },
    {
      date: formatDate(absenteeDeadline),
      description: 'Absentee ballot request deadline.',
    },
    {
      date: formatDate(electionDate),
      description:
        'Election Day. GOTV push via robocall and peer-to-peer text.',
    },
  ]

  return { timeline, highlights }
}

const buildContactSchedule = (electionDate: Date | null): ContactSend[] => {
  if (!electionDate) return []
  const sends: { offset: number; data: Omit<ContactSend, 'date'> }[] = [
    {
      offset: -20,
      data: {
        tactic: 'P2P Text',
        audience: 'All matched cells',
        purpose: 'Introduce yourself and your top priorities.',
        format: 'Personalized peer-to-peer text.',
      },
    },
    {
      offset: -10,
      data: {
        tactic: 'Robocall',
        audience: 'All matched landlines',
        purpose: 'Alert voters to registration deadline (today).',
        format: 'Automated voice call.',
      },
    },
    {
      offset: -5,
      data: {
        tactic: 'P2P Text',
        audience: 'All matched cells',
        purpose: 'Remind voters of absentee and mail ballot deadlines.',
        format: 'Peer-to-peer text.',
      },
    },
    {
      offset: -3,
      data: {
        tactic: 'Robocall',
        audience: 'All matched landlines',
        purpose: 'Encourage early voting and ballot returns.',
        format: 'Automated voice call.',
      },
    },
    {
      offset: -1,
      data: {
        tactic: 'P2P Text',
        audience: 'All matched cells',
        purpose: 'Day-before: polling location and reminder of candidacy.',
        format: 'Peer-to-peer text.',
      },
    },
    {
      offset: 0,
      data: {
        tactic: 'Robocall',
        audience: 'All matched landlines',
        purpose: 'GOTV push with poll hours.',
        format: 'Automated voice call.',
      },
    },
    {
      offset: 0,
      data: {
        tactic: 'P2P Text',
        audience: 'All matched cells',
        purpose: 'Final turnout push. Thank those who voted.',
        format: 'Peer-to-peer text.',
      },
    },
  ]

  return sends.map(({ offset, data }) => ({
    date: formatDate(addDays(electionDate, offset)),
    ...data,
  }))
}

const buildCivicEvents = (
  electionDate: Date | null,
  city: string,
): CivicEvent[] => {
  if (!electionDate) return []
  const cityLabel = placeholderCity(city)
  const event1 = addDays(electionDate, -23)
  const event2 = addDays(electionDate, -15)
  const event3 = addDays(electionDate, -13)
  return [
    {
      event: `${cityLabel} Community Fall Festival`,
      date: formatDate(event1),
      why: 'High family turnout. Strong opportunity for literature handoffs and name recognition.',
    },
    {
      event: `${cityLabel} Town Council Public Meeting`,
      date: formatDate(event2),
      why: "Demonstrate fluency with the council's actual agenda.",
    },
    {
      event: `${cityLabel} Civic Association Meeting`,
      date: formatDate(event3),
      why: 'The single highest-density event inside your target precinct.',
    },
  ]
}

const buildPressOutlets = (city: string, state: string): PressOutlet[] => {
  const cityLabel = placeholderCity(city)
  const stateLabel = placeholderState(state)
  return [
    {
      outlet: `${cityLabel} Times`,
      type: 'Daily newspaper. Broad area reach.',
      angle: 'Your profile or op-ed on a local policy priority.',
    },
    {
      outlet: `The ${cityLabel} Weekly`,
      type: 'Weekly. Deep local government coverage.',
      angle: 'Your Q&A. Respond quickly to any editorial coverage.',
    },
    {
      outlet: `${stateLabel} Local Radio`,
      type: 'Community radio.',
      angle: 'Short interview segment. Aim for drive-time window.',
    },
  ]
}

// NOTE: budget math mirrors OutreachPlanStep. If you tweak the constants there,
// match them here so the success-page plan stays consistent with what the
// candidate saw in onboarding.
const DOORS_PERCENT = 0.2
const ROBOCALLS_PERCENT = 0.2
const TEXTS_PERCENT = 0.6
const ROBOCALL_COST = 0.045
const TEXT_COST = 0.035
const MAIL_UNIVERSE_RATE = 0.4
const MAIL_COST_PER_PIECE = 0.55
const DIGITAL_COST_PER_CONTACT = 0.06
const SIGNS_PER_CONTACT_DENOMINATOR = 100
const SIGN_COST = 5
const DOOR_HANGER_COST = 0.2
const COMPLIANCE_FLAT_COST = 400

const formatDollars = (value: number): string =>
  `$${Math.round(value).toLocaleString('en-US')}`

interface BudgetBreakdown {
  totalBudget: number
  lineItems: BudgetRow[]
}

const buildBudgetBreakdown = (voterContactGoal: number): BudgetBreakdown => {
  const textCost = Math.round(voterContactGoal * TEXTS_PERCENT) * TEXT_COST
  const robocallCost =
    Math.round(voterContactGoal * ROBOCALLS_PERCENT) * ROBOCALL_COST
  const digitalCost = voterContactGoal * DIGITAL_COST_PER_CONTACT
  const mailCost =
    Math.round(voterContactGoal * MAIL_UNIVERSE_RATE) * MAIL_COST_PER_PIECE
  const totalDoors = Math.round(voterContactGoal * DOORS_PERCENT)
  const signCount = Math.max(
    0,
    Math.ceil(voterContactGoal / SIGNS_PER_CONTACT_DENOMINATOR),
  )
  const yardLitCost = signCount * SIGN_COST + totalDoors * DOOR_HANGER_COST
  const complianceCost = COMPLIANCE_FLAT_COST

  const totalBudget = Math.round(
    textCost +
      robocallCost +
      digitalCost +
      mailCost +
      yardLitCost +
      complianceCost,
  )

  const lineItems: BudgetRow[] = [
    {
      category: 'Text messages',
      amount: formatDollars(textCost),
      rationale:
        'Direct, scalable reach across your matched voter universe at the lowest cost per touch.',
    },
    {
      category: 'Robocalls',
      amount: formatDollars(robocallCost),
      rationale:
        "Catches landline-only voters that texts can't reach and reinforces your name on Election Day.",
    },
    {
      category: 'Digital ads',
      amount: formatDollars(digitalCost),
      rationale:
        'Geo-targeted reinforcement of name recognition across your district.',
    },
    {
      category: 'Direct mail',
      amount: formatDollars(mailCost),
      rationale:
        'Tangible household touch that lands at home, often seen by the whole family.',
    },
    {
      category: 'Yard signs & literature',
      amount: formatDollars(yardLitCost),
      rationale:
        'Local visibility multiplier. Every sign is a passive endorsement to every passerby.',
    },
    {
      category: 'Compliance & filing fees',
      amount: formatDollars(complianceCost),
      rationale: 'Mandatory state and local filings plus basic accounting.',
    },
  ]

  return { totalBudget, lineItems }
}

const KEY_ASSUMPTIONS: string[] = [
  'Turnout behaves like recent comparable off-year municipal elections in your area, roughly 18 to 24 percent of registered voters.',
  'Voter preferences distribute across the field without one opponent dominating. A plurality near 40 percent is often sufficient to win, but we plan to the more conservative 50% + 1 threshold.',
  'Phone match and deliverability rates are consistent with recent cycles. We assume roughly 60% cell deliverability and 35% landline answer rate.',
  'You will execute the contact cadence on schedule. Any slippage materially reduces the probability of hitting the contact goal.',
]

const PLAN_DOES_NOT_DO: string[] = [
  'It does not include a persuasion model. We are not scoring individual voters for likelihood of supporting you specifically, which would require survey data we do not have.',
  'It does not forecast a win probability. The race is close by design, and small shifts in turnout can flip the outcome.',
  'It does not replace local political judgment. Your own read of the community should override any single number in this document.',
]

const GLOSSARY: GlossaryRow[] = [
  {
    term: 'Projected Votes Needed to Win',
    definition:
      'The vote total needed to win the seat with certainty given the modeled voter turnout. Calculated as 50% plus one of projected voter turnout.',
  },
  {
    term: 'Projected Voter Turnout',
    definition:
      'The estimated number of registered voters expected to cast a ballot in this specific election, derived from a turnout model applied to recent comparable cycles.',
  },
  {
    term: 'Voter Contact Target',
    definition:
      'The total number of quality touches your campaign aims to deliver. Industry rule of thumb is 5x the win number.',
  },
  {
    term: 'Quality Touch',
    definition:
      'A contact attempt that reaches an intended voter via a channel capable of conveying the message (a delivered text, an answered call, an in-person conversation).',
  },
  {
    term: 'P2P Text (Peer-to-Peer Text)',
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
      'Get Out The Vote. The concentrated push in the final 72 hours to convert identified supporters into cast ballots.',
  },
]

const STRATEGY_BULLETS = [
  {
    title: "Mobilize, don't persuade.",
    body: 'In a small electorate with no party cue, repeated name exposure and turnout are the decisive levers, not ideological persuasion.',
  },
  {
    title: 'Stack the channels.',
    body: 'Coordinated voter contact via peer-to-peer text and robocall covers your full voter universe across the campaign.',
  },
  {
    title: 'Show up in person.',
    body: 'High-density civic events carry more weight per hour than any paid channel at this budget.',
  },
  {
    title: 'Lock one message.',
    body: 'Same name, same local issue, same ask on every send. Variation dilutes recognition.',
  },
]

const CANDIDATE_COMMITMENTS = [
  'Attend the three listed civic events in person.',
  'Secure at least one earned-media placement per week during the final month.',
  'Lock one concrete local issue as the consistent subject of every voter contact.',
  'Clear calendar capacity for 10 to 15 hours per week of campaign activity through Election Day.',
]

const BIGGEST_RISKS = [
  {
    title: 'Vote-splitting.',
    body: 'With multiple candidates on the ballot, a consolidated opposing base can win with as little as 35 to 40 percent of the vote. Your base must hold.',
  },
  {
    title: 'Small-universe volatility.',
    body: 'In a small voter universe, losing 30 committed supporters to weather, scheduling, or apathy moves the outcome by several percentage points. Contact redundancy is not optional.',
  },
  {
    title: 'Compressed outreach window.',
    body: 'Mail ballots begin distributing about three weeks before Election Day. Voters who return early cannot be persuaded late.',
  },
]

const OPPORTUNITIES = [
  {
    title: 'High reach potential.',
    body: 'Matched phone data lets you realistically touch every likely voter multiple times across the cycle.',
  },
  {
    title: 'Low absolute win number.',
    body: 'A small win number is a mobilization target, not a persuasion target. A disciplined turnout operation is the decisive lever.',
  },
  {
    title: 'Accessible earned media.',
    body: 'Local outlets cover local races closely. A single op-ed or profile can move a meaningful share of your voter universe.',
  },
  {
    title: 'Strong civic calendar.',
    body: 'Several high-value in-person events fall inside the final 30 days, listed in the Community Engagement section.',
  },
]

const CHALLENGES = [
  {
    title: 'Vote-splitting risk.',
    body: 'With multiple candidates on the ballot, your plan assumes the more conservative 50% + 1 target to absorb this risk.',
  },
  {
    title: 'No party cue.',
    body: 'A nonpartisan ballot means voters need repeated, standalone exposure to your name to recognize it when marking the ballot.',
  },
  {
    title: 'Compressed outreach window.',
    body: 'Absentee and mail ballots begin distributing weeks before Election Day. Early contact is non-negotiable.',
  },
  {
    title: 'Small-universe volatility.',
    body: 'A small voter universe amplifies any swing. Redundancy in contact is the hedge against weather, schedule, or apathy.',
  },
]

const KPIS = (
  voterContactGoal: number,
  volunteerHourTarget: number,
): KpiRow[] => [
  {
    kpi: 'Cumulative voter touches delivered',
    target: `${voterContactGoal.toLocaleString('en-US')} by Election Day`,
    cadence: 'Weekly Monday review',
  },
  {
    kpi: 'Volunteer hours logged',
    target: `${volunteerHourTarget}+ by Election Day`,
    cadence: 'Weekly Monday review',
  },
  {
    kpi: 'Earned-media placements',
    target: 'At least 3 by Election Day',
    cadence: 'Weekly Monday review',
  },
  {
    kpi: 'Yard signs placed',
    target: '40+ by 2 weeks before Election Day',
    cadence: 'Bi-weekly walkthrough',
  },
  {
    kpi: 'Absentee ballot requests among matched supporters',
    target: '40%+ by absentee deadline',
    cadence: 'Weekly after mail ballots open',
  },
  {
    kpi: 'Event attendance (you in person)',
    target: '3 of 3 civic events',
    cadence: 'Tracked per event',
  },
]

const DATA_SOURCES: DataSourceRow[] = [
  {
    metric: 'Registered voters in your district',
    source: 'Secretary of State voter file (public extract).',
    lastUpdated: 'Refreshed monthly',
  },
  {
    metric: 'Historical turnout',
    source:
      'Certified results for the three most recent comparable municipal cycles.',
    lastUpdated: 'As of last certified election',
  },
  {
    metric: 'Phone match rates',
    source:
      'Commercial voter-file append (industry-standard L2 / TargetSmart matching).',
    lastUpdated: 'Rolling 90-day refresh',
  },
  {
    metric: 'Opponent-field data (opponents, seats)',
    source: 'Local elections office candidate filings.',
    lastUpdated: 'As of filing deadline',
  },
  {
    metric: 'Civic event calendar',
    source: 'Public local calendars and civic association announcements.',
    lastUpdated: 'Refreshed weekly',
  },
  {
    metric: 'Press and media outlets',
    source:
      'GoodParty.org local-media directory, cross-checked against outlet websites.',
    lastUpdated: 'Rolling',
  },
]

const buildConfidenceEstimates = (
  projectedTurnout: number,
  projectedTurnoutLow: number,
  projectedTurnoutHigh: number,
  winNumber: number,
  winNumberLow: number,
  winNumberHigh: number,
  matchedCell: number,
  matchedLandline: number,
): ConfidenceRow[] => [
  {
    estimate: 'Projected voter turnout',
    pointValue: projectedTurnout.toLocaleString('en-US'),
    range: `${projectedTurnoutLow.toLocaleString(
      'en-US',
    )} to ${projectedTurnoutHigh.toLocaleString('en-US')}`,
    notes:
      'Based on 3-cycle turnout average plus or minus one standard deviation.',
  },
  {
    estimate: 'Projected votes needed to win (50% + 1)',
    pointValue: winNumber.toLocaleString('en-US'),
    range: `${winNumberLow.toLocaleString(
      'en-US',
    )} to ${winNumberHigh.toLocaleString('en-US')}`,
    notes: 'Moves with the voter universe.',
  },
  {
    estimate: 'Matched cell-phone records',
    pointValue: matchedCell.toLocaleString('en-US'),
    range: `${Math.round(matchedCell * 0.95).toLocaleString(
      'en-US',
    )} to ${Math.round(matchedCell * 1.05).toLocaleString('en-US')}`,
    notes: 'Match-rate variance ±5%.',
  },
  {
    estimate: 'Matched landline records',
    pointValue: matchedLandline.toLocaleString('en-US'),
    range: `${Math.round(matchedLandline * 0.95).toLocaleString(
      'en-US',
    )} to ${Math.round(matchedLandline * 1.05).toLocaleString('en-US')}`,
    notes: 'Match-rate variance ±5%.',
  },
  {
    estimate: 'Projected P2P text deliverability',
    pointValue: '~85%',
    range: '80% to 90%',
    notes: 'Industry benchmark (US wireless).',
  },
  {
    estimate: 'Projected robocall answer rate',
    pointValue: '~30%',
    range: '25% to 35%',
    notes: 'Industry benchmark (landline).',
  },
]

export const buildPlanData = (input: PlanInput): PlanData => {
  const candidateName = input.candidateName || 'Your campaign'
  const race = input.race || 'Your race'
  const location = [input.city, input.state].filter(Boolean).join(', ')

  const electionDateRaw = input.electionDateIso
    ? new Date(input.electionDateIso)
    : null
  const electionDate =
    electionDateRaw && !Number.isNaN(electionDateRaw.getTime())
      ? formatDate(electionDateRaw)
      : ''
  const electionDateValid =
    electionDateRaw && !Number.isNaN(electionDateRaw.getTime())
      ? electionDateRaw
      : null

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

  const matchedCellRecords = Math.max(
    0,
    Math.round(projectedTurnout * PLACEHOLDER_MATCH_RATE_CELL * 4),
  )
  const matchedLandlineRecords = Math.max(
    0,
    Math.round(projectedTurnout * PLACEHOLDER_MATCH_RATE_LANDLINE * 2),
  )
  const volunteerHourTarget = Math.max(
    100,
    Math.round((winNumber || 0) / 3 / 10) * 10,
  )
  const averageTouchesPerVoter =
    projectedTurnout > 0
      ? Number((voterContactGoal / projectedTurnout).toFixed(1))
      : 0

  const { totalBudget, lineItems: budgetLineItems } =
    buildBudgetBreakdown(voterContactGoal)

  // Weekly cadence targets (mirror OutreachPlanStep assumptions).
  const CANDIDATE_HOURS_PER_WEEK = 14
  const VOLUNTEER_HOURS_PER_WEEK_EACH = 3
  const DOORS_PER_HOUR = 15
  const MAX_CAMPAIGN_WEEKS = 12
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
  const totalDoors = Math.round(voterContactGoal * 0.2)
  const doorsPerWeek = totalDoors / weeksRemaining
  const candidateDoorsPerWeek = CANDIDATE_HOURS_PER_WEEK * DOORS_PER_HOUR
  const volunteerDoorsPerWeek = Math.max(
    0,
    doorsPerWeek - candidateDoorsPerWeek,
  )
  const volunteerHoursPerWeek =
    Math.round(volunteerDoorsPerWeek / DOORS_PER_HOUR / 1) * 1
  const filingDeadline = electionDateValid
    ? formatDate(addDays(electionDateValid, -40))
    : null
  void VOLUNTEER_HOURS_PER_WEEK_EACH

  const { timeline, highlights } = buildTimeline(electionDateValid)
  const contactSchedule = buildContactSchedule(electionDateValid)
  const civicEvents = buildCivicEvents(electionDateValid, input.city)
  const pressOutlets = buildPressOutlets(input.city, input.state)
  const kpis = KPIS(voterContactGoal, volunteerHourTarget)
  const confidenceEstimates = buildConfidenceEstimates(
    projectedTurnout,
    projectedTurnoutLow,
    projectedTurnoutHigh,
    winNumber,
    winNumberLow,
    winNumberHigh,
    matchedCellRecords,
    matchedLandlineRecords,
  )

  const keyNumbers: KeyNumber[] = [
    {
      metric: 'Projected votes needed to win',
      target: winNumber.toLocaleString('en-US'),
    },
    {
      metric: 'Projected voter turnout',
      target: `${projectedTurnout.toLocaleString(
        'en-US',
      )} (range ${projectedTurnoutLow.toLocaleString(
        'en-US',
      )} to ${projectedTurnoutHigh.toLocaleString('en-US')})`,
    },
    {
      metric: 'Voter contact target',
      target: voterContactGoal.toLocaleString('en-US'),
    },
    {
      metric: 'Matched cell-phone records',
      target: matchedCellRecords.toLocaleString('en-US'),
    },
    {
      metric: 'Matched landline records',
      target: matchedLandlineRecords.toLocaleString('en-US'),
    },
    {
      metric: 'Volunteer-hour target',
      target: `${volunteerHourTarget}+`,
    },
    {
      metric: 'Total recommended budget',
      target: `≈ $${totalBudget.toLocaleString('en-US')}`,
    },
  ]

  const metrics: MetricRow[] = [
    {
      metric: 'Projected votes needed to win',
      target: winNumber.toLocaleString('en-US'),
      source: '50% + 1 of projected voter turnout.',
    },
    {
      metric: 'Projected voter turnout',
      target: projectedTurnout.toLocaleString('en-US'),
      source:
        'Turnout model applied to active registered voters in your district.',
    },
    {
      metric: 'Voter contact target (quality touches)',
      target: voterContactGoal.toLocaleString('en-US'),
      source: '5x votes-to-win, industry rule of thumb for local races.',
    },
    {
      metric: 'Matched cell-phone records',
      target: matchedCellRecords.toLocaleString('en-US'),
      source: 'Voter file append, commercial match.',
    },
    {
      metric: 'Matched landline records',
      target: matchedLandlineRecords.toLocaleString('en-US'),
      source: 'Voter file append, commercial match.',
    },
    {
      metric: 'Average touches per likely voter',
      target: `~${averageTouchesPerVoter}`,
      source: 'Voter contact target divided by projected turnout.',
    },
    {
      metric: 'Volunteer-hour target',
      target: `${volunteerHourTarget}+`,
      source: 'Benchmark: about 1 volunteer hour per 3 votes needed.',
    },
  ]

  return {
    candidateName,
    race,
    location,
    electionDate,
    electionDateRaw: electionDateValid,
    winNumber,
    winNumberLow,
    winNumberHigh,
    projectedTurnout,
    projectedTurnoutLow,
    projectedTurnoutHigh,
    voterContactGoal,
    opponentCount: FALLBACK_OPPONENT_COUNT,
    matchedCellRecords,
    matchedLandlineRecords,
    volunteerHourTarget,
    totalBudget,
    averageTouchesPerVoter,
    candidateHoursPerWeek: CANDIDATE_HOURS_PER_WEEK,
    volunteerHoursPerWeek,
    weeksRemaining,
    filingDeadline,
    strategyBullets: STRATEGY_BULLETS,
    keyNumbers,
    timelineHighlights: highlights,
    candidateCommitments: CANDIDATE_COMMITMENTS,
    biggestRisks: BIGGEST_RISKS,
    opportunities: OPPORTUNITIES,
    challenges: CHALLENGES,
    metrics,
    timeline,
    budgetLineItems,
    budgetNotCovered: [
      {
        title: 'Paid staff.',
        body: 'This plan assumes an all-volunteer operation.',
      },
      {
        title: 'Polling.',
        body: 'In a small voter universe, a statistically valid poll would cost more than the entire campaign.',
      },
    ],
    civicEvents,
    pressOutlets,
    contactSchedule,
    kpis,
    dataSources: DATA_SOURCES,
    keyAssumptions: KEY_ASSUMPTIONS,
    confidenceEstimates,
    planDoesNotDo: PLAN_DOES_NOT_DO,
    glossary: GLOSSARY,
  }
}
