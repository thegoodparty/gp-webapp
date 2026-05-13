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

export interface Opponent {
  name: string
  party: string
  isIncumbent: boolean
  lastVoteShare: string
  positions: string[]
  websites: string[]
}

export interface PlanData {
  // Identity
  candidateName: string
  race: string
  location: string
  districtName: string
  electionDate: string
  electionDateRaw: Date | null
  planGenerationDate: string
  // Approximate window when first voter contact should land — 12 weeks before E-Day.
  contactWindowStart: string

  // Numbers
  winNumber: number
  winNumberLow: number
  winNumberHigh: number
  projectedTurnout: number
  projectedTurnoutLow: number
  projectedTurnoutHigh: number
  registeredVoters: number
  voterContactGoal: number

  // Placeholder identity numbers
  opponentCount: number
  matchedCellRecords: number
  matchedLandlineRecords: number
  volunteerHourTarget: number
  totalBudget: number
  averageTouchesPerVoter: number
  eventCount: number
  mediaCount: number

  // Weekly cadence targets
  candidateHoursPerWeek: number
  volunteerHoursPerWeek: number
  weeksRemaining: number
  filingDeadline: string | null

  // Executive summary
  planAtAGlance: { title: string; body: string }[]
  keyCampaignTargets: KeyTarget[]
  keyDates: KeyDate[]

  // Strategic landscape
  opportunities: { title: string; body: string }[]
  challenges: { title: string; body: string }[]
  opponents: Opponent[]

  // Electoral goals
  metrics: MetricRow[]

  // Campaign timeline
  timeline: TimelineRow[]

  // Budget
  budgetLineItems: BudgetRow[]
  fundraisingMix: FundraisingRow[]

  // Community engagement
  civicEvents: CivicEvent[]
  pressOutlets: PressOutlet[]

  // Voter contact
  contactSchedule: ContactSend[]

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
  keyDates: KeyDate[]
} => {
  if (!electionDate) {
    return { timeline: [], keyDates: [] }
  }
  const filing = addDays(electionDate, -40)
  const messagingLocked = addDays(electionDate, -27)
  const ballotsStart = addDays(electionDate, -25)
  const voterRegDeadline = addDays(electionDate, -10)
  const absenteeDeadline = addDays(electionDate, -7)

  const timeline: TimelineRow[] = [
    {
      date: formatDate(filing),
      milestone: 'Nomination papers filed with Town Clerk',
      notes: 'Bring two backup copies.',
    },
    {
      date: formatDate(messagingLocked),
      milestone: 'Messaging, branding, and printed materials finalized',
      notes: 'Lock down before first voter contact campaign.',
    },
    {
      date: formatDate(ballotsStart),
      milestone:
        'Absentee / mail-in ballot distribution begins (by Town Clerk)',
      notes:
        'Plan introduction text and robocall campaigns to be sent before this deadline.',
    },
    {
      date: formatDate(voterRegDeadline),
      milestone: 'Voter registration deadline',
      notes: 'Push via robocall campaign.',
    },
    {
      date: formatDate(absenteeDeadline),
      milestone: 'Absentee ballot request deadline',
      notes: 'Push via text campaign.',
    },
    {
      date: formatDate(electionDate),
      milestone: 'Election Day, polls open; absentee ballots due',
      notes:
        'All hands on deck; push via GOTV text and robocall campaigns.',
    },
  ]

  const keyDates: KeyDate[] = [
    {
      date: formatDate(filing),
      description: 'Nomination papers filed with Town Clerk.',
    },
    {
      date: formatDate(ballotsStart),
      description:
        'Absentee / mail ballots begin distributing. First voter contact must land by this date.',
    },
    {
      date: formatDate(addDays(electionDate, -20)),
      description: '{N} community events that you should personally attend.',
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
      description: 'Election Day.',
    },
  ]

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
      address: '{event_address}',
      date: formatDate(event1),
      why: 'High family turnout; literature handoffs and name recognition.',
    },
    {
      event: `${cityLabel} Town Council Public Meeting`,
      address: '{event_address}',
      date: formatDate(event2),
      why: "Demonstrate fluency with the council's actual agenda.",
    },
    {
      event: `${cityLabel} Civic Association Meeting`,
      address: '{event_address}',
      date: formatDate(event3),
      why: 'The single highest-density event in the actual target precinct.',
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
      angle: 'Candidate profile or op-ed on local policy priority.',
      contact: '{address}\n{phone_number}\n{email}',
    },
    {
      outlet: `The ${cityLabel} Weekly`,
      type: 'Weekly. Deep local government coverage.',
      angle: 'Candidate Q&A; respond quickly to any editorial coverage.',
      contact: '{address}\n{phone_number}\n{email}',
    },
    {
      outlet: `${stateLabel} Local Radio`,
      type: 'Community radio.',
      angle: 'Short interview segment; drive-time window.',
      contact: '{address}\n{phone_number}\n{email}',
    },
  ]
}

// Budget math mirrors OutreachPlanStep. Constants are placeholders; revisit with
// strategy. Yard signs / palm cards are doc-exact dollar values (not formulas).
const FILING_FEE = 100
const YARD_SIGNS_COST = 385
const PALM_CARDS_COST = 67
const TEXT_CAMPAIGN_COUNT = 4
const ROBOCALL_CAMPAIGN_COUNT = 3
const TEXT_COST = 0.035
const ROBOCALL_COST = 0.045
const CONTINGENCY_RATE = 0.05

const formatDollars = (value: number): string =>
  `$${Math.round(value).toLocaleString('en-US')}`

interface BudgetBreakdown {
  totalBudget: number
  lineItems: BudgetRow[]
}

const buildBudgetBreakdown = (
  matchedCell: number,
  matchedLandline: number,
): BudgetBreakdown => {
  const textCampaignsCost = TEXT_CAMPAIGN_COUNT * matchedCell * TEXT_COST
  const robocallCampaignsCost =
    ROBOCALL_CAMPAIGN_COUNT * matchedLandline * ROBOCALL_COST
  const subtotal =
    FILING_FEE +
    YARD_SIGNS_COST +
    PALM_CARDS_COST +
    textCampaignsCost +
    robocallCampaignsCost
  const contingency = subtotal * CONTINGENCY_RATE
  const totalBudget = Math.round(subtotal + contingency)

  const lineItems: BudgetRow[] = [
    {
      category: 'Filing fees',
      amount: formatDollars(FILING_FEE),
      rationale: 'Nomination papers, any mandatory state/local filings.',
    },
    {
      category: 'Yard signs',
      amount: formatDollars(YARD_SIGNS_COST),
      rationale:
        'Core visibility in a small precinct; reusable between canvassers; estimated 50 yard signs for $385.',
    },
    {
      category: 'Palm cards',
      amount: formatDollars(PALM_CARDS_COST),
      rationale:
        'Handoffs at events and passive drops where canvassing allows; estimated 250 palm cards for $67.',
    },
    {
      category: 'Text campaigns',
      amount: formatDollars(textCampaignsCost),
      rationale: `${TEXT_CAMPAIGN_COUNT} text campaigns to ${matchedCell.toLocaleString(
        'en-US',
      )} at $${TEXT_COST.toFixed(3)} per text.`,
    },
    {
      category: 'Robocall campaigns',
      amount: formatDollars(robocallCampaignsCost),
      rationale: `${ROBOCALL_CAMPAIGN_COUNT} robocall campaigns to ${matchedLandline.toLocaleString(
        'en-US',
      )} at $${ROBOCALL_COST.toFixed(3)} per call.`,
    },
    {
      category: 'Contingency (5%)',
      amount: formatDollars(contingency),
      rationale: 'Reserve for last-week opportunities.',
    },
    {
      category: 'Total',
      amount: formatDollars(totalBudget),
      rationale: 'Sum of all budget line-items.',
    },
  ]

  return { totalBudget, lineItems }
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
    term: 'Projected Votes to Win',
    definition:
      'The vote total at which a candidate would win the seat with certainty given the modeled voter turnout. Calculated as 50% + 1 of the projected voter turnout.',
  },
  {
    term: 'Projected Voter Turnout',
    definition:
      'The estimated number of registered voters expected to cast a ballot in this specific election, derived from a turnout model applied to recent comparable cycles.',
  },
  {
    term: 'Targeted Voter Contact Goal',
    definition:
      'The total number of contacts sent to voters that the campaign aims to deliver. Industry rule of thumb is 5× the projected votes to win.',
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

// "Campaign Plan at a Glance" — doc flags these as LLM-generated. Static
// placeholders below render the doc's example copy with dynamic fields filled.
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
    body: `${eventCount} high-density community events during your campaign carry more weight per hour than any paid channel.`,
  },
  {
    title: 'Message discipline.',
    body: 'Define your core values and top issues that matter to you and your voters and stay consistent in how you communicate them.',
  },
]

// Opportunities and challenges — doc flags as LLM-generated. Doc example copy
// preserved as static placeholders.
const OPPORTUNITIES = [
  {
    title: 'Low absolute projected votes to win.',
    body: 'A small win number is a target, not a ceiling. A disciplined turnout operation, not a media war, is the decisive lever (see Section 2).',
  },
  {
    title: 'Accessible earned media.',
    body: 'Credible local outlets cover town-council races closely. A single op-ed or profile can move a meaningful share of the votes (see Section 5).',
  },
  {
    title: 'Strong civic calendar.',
    body: 'High-value in-person opportunities fall inside the race window (see Section 5).',
  },
]

const CHALLENGES = [
  {
    title: 'Vote-splitting risk.',
    body: 'With multiple candidates on the ballot, a consolidated opposing base can win with as little as 35–40% of the votes. Our plan assumes the more conservative win-number target to absorb this risk.',
  },
  {
    title: 'No party ballot affiliation.',
    body: 'Nonpartisan ballots mean voters need repeated, standalone exposure to your name to recognize it when marking the ballot. Name recognition has to be built one voter contact at a time.',
  },
  {
    title: 'Compressed contact window.',
    body: 'Absentee, mail, or early ballots distribute weeks before Election Day. Voters who return early cannot be persuaded late — early contact is non-negotiable.',
  },
  {
    title: 'Small-district volatility.',
    body: 'In a small voter universe, losing a few dozen committed supporters to weather, scheduling, or apathy moves the outcome by several percentage points. Redundancy in voter contact is not optional.',
  },
  {
    title: 'No institutional endorsements at launch.',
    body: 'Established organizations typically endorse candidates they already know. Endorsement outreach has to start in the first 30 days because most groups vote on endorsements months before Election Day.',
  },
  {
    title: 'No prior donor list to inherit.',
    body: 'Every dollar in your first 60 days has to be raised through cold asks to your personal network before extending out to contributors you do not already know.',
  },
  {
    title: 'No existing volunteer base.',
    body: 'The first 30 days should prioritize recruiting and training a core team of 5–10 volunteers, even if it slows other work.',
  },
  {
    title: 'Debate and forum access is not automatic.',
    body: "Candidate forums and debates are organized by civic groups, newspapers, or chambers of commerce, and inclusion depends on the organizer's discretion. Proactively contact every forum host in the district.",
  },
  {
    title: 'Ballot access requirements have hard deadlines.',
    body: 'Qualifying for the ballot requires meeting your jurisdiction-specific requirements by a fixed deadline. Work has to start early enough to absorb invalid signatures, paperwork errors, or timing risk.',
  },
]

// Opposition Research is rendered only when opponents.length >= 1. We don't yet
// have opponent data from the campaign object, so this is a placeholder that
// shows the doc's structure with {variable} slots.
const OPPONENTS_PLACEHOLDER: Opponent[] = [
  {
    name: '{opponent_name_1}',
    party: '{party}',
    isIncumbent: false,
    lastVoteShare: '{last_vote_share}',
    positions: [
      'Position on issue 1',
      'Position on issue 2',
      'Position on issue 3',
    ],
    websites: ['{website_1}'],
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
      'Town Clerk certified results for the three most recent comparable municipal cycles.',
    lastUpdated: 'As of last certified election',
  },
  {
    metric: 'Phone match rates',
    source:
      'Commercial voter-file append (industry-standard L2 / TargetSmart matching).',
    lastUpdated: 'Rolling 90-day refresh',
  },
  {
    metric: 'Candidate-field data (opponents, seats)',
    source: 'Town Clerk candidate filings.',
    lastUpdated: 'As of filing deadline',
  },
  {
    metric: 'Community event calendar',
    source:
      'Public local calendars and civic association announcements.',
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
): ConfidenceRow[] => [
  {
    estimate: 'Projected voter turnout',
    pointValue: projectedTurnout.toLocaleString('en-US'),
    range: `${projectedTurnoutLow.toLocaleString(
      'en-US',
    )}–${projectedTurnoutHigh.toLocaleString('en-US')}`,
    notes: 'Based on 3-cycle turnout average.',
  },
  {
    estimate: 'Projected votes to win',
    pointValue: winNumber.toLocaleString('en-US'),
    range: `${winNumberLow.toLocaleString(
      'en-US',
    )}–${winNumberHigh.toLocaleString('en-US')}`,
    notes: 'Moves with the targeted voters.',
  },
  {
    estimate: 'Projected text deliverability',
    pointValue: '~85%',
    range: '80–90%',
    notes: 'Industry benchmark.',
  },
  {
    estimate: 'Projected robocall listen rate',
    pointValue: '~30%',
    range: '25–35%',
    notes: 'Industry benchmark.',
  },
]

export const buildPlanData = (input: PlanInput): PlanData => {
  const candidateName = input.candidateName || 'Your campaign'
  const race = input.race || 'Your race'
  const location = [input.city, input.state].filter(Boolean).join(', ')
  const districtName = location || '{district_name}'

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

  // Placeholder registered-voter count — derived from projected turnout
  // assuming ~22% turnout. Replace once we have a real registered-voter source.
  const registeredVoters =
    projectedTurnout > 0 ? Math.round(projectedTurnout / 0.22) : 0
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

  const { totalBudget, lineItems: budgetLineItems } = buildBudgetBreakdown(
    matchedCellRecords,
    matchedLandlineRecords,
  )

  const CANDIDATE_HOURS_PER_WEEK = 14
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
  const volunteerHoursPerWeek = Math.round(
    volunteerDoorsPerWeek / DOORS_PER_HOUR,
  )
  const filingDeadline = electionDateValid
    ? formatDate(addDays(electionDateValid, -40))
    : null

  const { timeline, keyDates } = buildTimeline(electionDateValid)
  const contactSchedule = buildContactSchedule(electionDateValid)
  const civicEvents = buildCivicEvents(electionDateValid, input.city)
  const pressOutlets = buildPressOutlets(input.city, input.state)
  const eventCount = civicEvents.length
  const mediaCount = pressOutlets.length
  const confidenceEstimates = buildConfidenceEstimates(
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

  const keyCampaignTargets: KeyTarget[] = [
    {
      metric: 'Projected Votes to Win',
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
      metric: 'Projected Votes to Win',
      target: `${winNumber.toLocaleString('en-US')} votes needed to win`,
      source: 'Projecting a simple majority (50% + 1) of projected voter turnout.',
    },
    {
      metric: 'Contacts Per Likely Voter',
      target: '5 contacts per likely voter',
      source: 'Industry standard number of contacts for winning campaigns.',
    },
    {
      metric: 'Voter Contact Target',
      target: `${voterContactGoal.toLocaleString('en-US')} total voter contacts`,
      source: 'Voter Contacts × Votes-to-Win.',
    },
    {
      metric: 'Volunteer-Hour Target',
      target: `${volunteerHourTarget.toLocaleString('en-US')} volunteer hours`,
      source: 'Benchmark: 1 volunteer hour per ~3 votes needed.',
    },
  ]

  return {
    candidateName,
    race,
    location,
    districtName,
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
    voterContactGoal,
    opponentCount: FALLBACK_OPPONENT_COUNT,
    matchedCellRecords,
    matchedLandlineRecords,
    volunteerHourTarget,
    totalBudget,
    averageTouchesPerVoter,
    eventCount,
    mediaCount,
    candidateHoursPerWeek: CANDIDATE_HOURS_PER_WEEK,
    volunteerHoursPerWeek,
    weeksRemaining,
    filingDeadline,
    planAtAGlance,
    keyCampaignTargets,
    keyDates,
    opportunities: OPPORTUNITIES,
    challenges: CHALLENGES,
    opponents: OPPONENTS_PLACEHOLDER,
    metrics,
    timeline,
    budgetLineItems,
    fundraisingMix: FUNDRAISING_MIX,
    civicEvents,
    pressOutlets,
    contactSchedule,
    dataSources: DATA_SOURCES,
    keyAssumptions: KEY_ASSUMPTIONS,
    confidenceEstimates,
    planDoesNotDo: PLAN_DOES_NOT_DO,
    glossary: GLOSSARY,
  }
}
