export interface ContactGoalBreakdown {
  total: number
  doorKnocking: number
  calls: number
  digital: number
}

export type WeekKey =
  | 'week12'
  | 'week11'
  | 'week10'
  | 'week9'
  | 'week8'
  | 'week7'
  | 'week6'
  | 'week5'
  | 'week4'
  | 'week3'
  | 'week2'
  | 'week1'

const WEEK_KEYS: WeekKey[] = [
  'week12',
  'week11',
  'week10',
  'week9',
  'week8',
  'week7',
  'week6',
  'week5',
  'week4',
  'week3',
  'week2',
  'week1',
]

export interface ContactGoals {
  week12: ContactGoalBreakdown
  week11: ContactGoalBreakdown
  week10: ContactGoalBreakdown
  week9: ContactGoalBreakdown
  week8: ContactGoalBreakdown
  week7: ContactGoalBreakdown
  week6: ContactGoalBreakdown
  week5: ContactGoalBreakdown
  week4: ContactGoalBreakdown
  week3: ContactGoalBreakdown
  week2: ContactGoalBreakdown
  week1: ContactGoalBreakdown
}

export interface ReportedVoterGoals {
  doorKnocking?: number
  calls?: number
  digital?: number
  directMail?: number
  digitalAds?: number
  text?: number
  events?: number
  robocall?: number
  phoneBanking?: number
  socialMedia?: number
}

export interface PathToVictoryGoals {
  voterContactGoal?: number
  voteGoal?: number
}

const WEEK_PERCENTAGES: ContactGoals = {
  week12: { total: 2.7, doorKnocking: 0, calls: 0, digital: 0 },
  week11: { total: 4.05, doorKnocking: 0, calls: 0, digital: 0 },
  week10: { total: 4.05, doorKnocking: 0, calls: 0, digital: 0 },
  week9: { total: 5.41, doorKnocking: 0, calls: 0, digital: 0 },
  week8: { total: 8.11, doorKnocking: 0, calls: 0, digital: 0 },
  week7: { total: 8.11, doorKnocking: 0, calls: 0, digital: 0 },
  week6: { total: 9.46, doorKnocking: 0, calls: 0, digital: 0 },
  week5: { total: 9.46, doorKnocking: 0, calls: 0, digital: 0 },
  week4: { total: 10.81, doorKnocking: 0, calls: 0, digital: 0 },
  week3: { total: 10.81, doorKnocking: 0, calls: 0, digital: 0 },
  week2: { total: 13.51, doorKnocking: 0, calls: 0, digital: 0 },
  week1: { total: 13.51, doorKnocking: 0, calls: 0, digital: 0 },
}

const createContactGoalBreakdown = (
  weekTotal: number,
): ContactGoalBreakdown => ({
  total: weekTotal,
  doorKnocking: parseInt(String(weekTotal * 0.2), 10),
  calls: parseInt(String(weekTotal * 0.35), 10),
  digital: parseInt(String(weekTotal * 0.45), 10),
})

export function calculateContactGoals(total: number): ContactGoals | false {
  if (!total) {
    return false
  }

  const week12Total = parseInt(
    String((total * WEEK_PERCENTAGES.week12.total) / 100),
    10,
  )
  const week11Total = parseInt(
    String((total * WEEK_PERCENTAGES.week11.total) / 100),
    10,
  )
  const week10Total = parseInt(
    String((total * WEEK_PERCENTAGES.week10.total) / 100),
    10,
  )
  const week9Total = parseInt(
    String((total * WEEK_PERCENTAGES.week9.total) / 100),
    10,
  )
  const week8Total = parseInt(
    String((total * WEEK_PERCENTAGES.week8.total) / 100),
    10,
  )
  const week7Total = parseInt(
    String((total * WEEK_PERCENTAGES.week7.total) / 100),
    10,
  )
  const week6Total = parseInt(
    String((total * WEEK_PERCENTAGES.week6.total) / 100),
    10,
  )
  const week5Total = parseInt(
    String((total * WEEK_PERCENTAGES.week5.total) / 100),
    10,
  )
  const week4Total = parseInt(
    String((total * WEEK_PERCENTAGES.week4.total) / 100),
    10,
  )
  const week3Total = parseInt(
    String((total * WEEK_PERCENTAGES.week3.total) / 100),
    10,
  )
  const week2Total = parseInt(
    String((total * WEEK_PERCENTAGES.week2.total) / 100),
    10,
  )
  const week1Total = parseInt(
    String((total * WEEK_PERCENTAGES.week1.total) / 100),
    10,
  )

  return {
    week12: createContactGoalBreakdown(week12Total),
    week11: createContactGoalBreakdown(week11Total),
    week10: createContactGoalBreakdown(week10Total),
    week9: createContactGoalBreakdown(week9Total),
    week8: createContactGoalBreakdown(week8Total),
    week7: createContactGoalBreakdown(week7Total),
    week6: createContactGoalBreakdown(week6Total),
    week5: createContactGoalBreakdown(week5Total),
    week4: createContactGoalBreakdown(week4Total),
    week3: createContactGoalBreakdown(week3Total),
    week2: createContactGoalBreakdown(week2Total),
    week1: createContactGoalBreakdown(week1Total),
  }
}

export interface AccumulatedTotal {
  doorKnocking: number
  calls: number
  digital: number
}

const getWeekKeyByIndex = (index: number): WeekKey | undefined => {
  if (index >= 1 && index <= 12) {
    return WEEK_KEYS[12 - index]
  }
  return undefined
}

export function calculateAccumulated(
  weeks: number,
  contactGoals: ContactGoals,
): AccumulatedTotal {
  const accumulatedTotal: AccumulatedTotal = {
    doorKnocking: 0,
    calls: 0,
    digital: 0,
  }
  if (weeks > 12) {
    return contactGoals.week12
  }
  for (let i = weeks; i <= 12; i++) {
    const key = getWeekKeyByIndex(i)
    if (key) {
      accumulatedTotal.doorKnocking += contactGoals[key]?.doorKnocking || 0
      accumulatedTotal.calls += contactGoals[key]?.calls || 0
      accumulatedTotal.digital += contactGoals[key]?.digital || 0
    }
  }

  return accumulatedTotal
}

export function calculateAccumulatedByWeek(
  contactGoals: ContactGoals,
): ContactGoals {
  const accumulatedTotal: ContactGoals = {
    week12: {
      total: 0,
      doorKnocking: contactGoals.week12?.doorKnocking || 0,
      calls: contactGoals.week12?.calls || 0,
      digital: contactGoals.week12?.digital || 0,
    },
    week11: { total: 0, doorKnocking: 0, calls: 0, digital: 0 },
    week10: { total: 0, doorKnocking: 0, calls: 0, digital: 0 },
    week9: { total: 0, doorKnocking: 0, calls: 0, digital: 0 },
    week8: { total: 0, doorKnocking: 0, calls: 0, digital: 0 },
    week7: { total: 0, doorKnocking: 0, calls: 0, digital: 0 },
    week6: { total: 0, doorKnocking: 0, calls: 0, digital: 0 },
    week5: { total: 0, doorKnocking: 0, calls: 0, digital: 0 },
    week4: { total: 0, doorKnocking: 0, calls: 0, digital: 0 },
    week3: { total: 0, doorKnocking: 0, calls: 0, digital: 0 },
    week2: { total: 0, doorKnocking: 0, calls: 0, digital: 0 },
    week1: { total: 0, doorKnocking: 0, calls: 0, digital: 0 },
  }

  // Accumulate from week 11 down to week 1
  accumulatedTotal.week11.doorKnocking =
    contactGoals.week11.doorKnocking + accumulatedTotal.week12.doorKnocking
  accumulatedTotal.week11.calls =
    contactGoals.week11.calls + accumulatedTotal.week12.calls
  accumulatedTotal.week11.digital =
    contactGoals.week11.digital + accumulatedTotal.week12.digital

  accumulatedTotal.week10.doorKnocking =
    contactGoals.week10.doorKnocking + accumulatedTotal.week11.doorKnocking
  accumulatedTotal.week10.calls =
    contactGoals.week10.calls + accumulatedTotal.week11.calls
  accumulatedTotal.week10.digital =
    contactGoals.week10.digital + accumulatedTotal.week11.digital

  accumulatedTotal.week9.doorKnocking =
    contactGoals.week9.doorKnocking + accumulatedTotal.week10.doorKnocking
  accumulatedTotal.week9.calls =
    contactGoals.week9.calls + accumulatedTotal.week10.calls
  accumulatedTotal.week9.digital =
    contactGoals.week9.digital + accumulatedTotal.week10.digital

  accumulatedTotal.week8.doorKnocking =
    contactGoals.week8.doorKnocking + accumulatedTotal.week9.doorKnocking
  accumulatedTotal.week8.calls =
    contactGoals.week8.calls + accumulatedTotal.week9.calls
  accumulatedTotal.week8.digital =
    contactGoals.week8.digital + accumulatedTotal.week9.digital

  accumulatedTotal.week7.doorKnocking =
    contactGoals.week7.doorKnocking + accumulatedTotal.week8.doorKnocking
  accumulatedTotal.week7.calls =
    contactGoals.week7.calls + accumulatedTotal.week8.calls
  accumulatedTotal.week7.digital =
    contactGoals.week7.digital + accumulatedTotal.week8.digital

  accumulatedTotal.week6.doorKnocking =
    contactGoals.week6.doorKnocking + accumulatedTotal.week7.doorKnocking
  accumulatedTotal.week6.calls =
    contactGoals.week6.calls + accumulatedTotal.week7.calls
  accumulatedTotal.week6.digital =
    contactGoals.week6.digital + accumulatedTotal.week7.digital

  accumulatedTotal.week5.doorKnocking =
    contactGoals.week5.doorKnocking + accumulatedTotal.week6.doorKnocking
  accumulatedTotal.week5.calls =
    contactGoals.week5.calls + accumulatedTotal.week6.calls
  accumulatedTotal.week5.digital =
    contactGoals.week5.digital + accumulatedTotal.week6.digital

  accumulatedTotal.week4.doorKnocking =
    contactGoals.week4.doorKnocking + accumulatedTotal.week5.doorKnocking
  accumulatedTotal.week4.calls =
    contactGoals.week4.calls + accumulatedTotal.week5.calls
  accumulatedTotal.week4.digital =
    contactGoals.week4.digital + accumulatedTotal.week5.digital

  accumulatedTotal.week3.doorKnocking =
    contactGoals.week3.doorKnocking + accumulatedTotal.week4.doorKnocking
  accumulatedTotal.week3.calls =
    contactGoals.week3.calls + accumulatedTotal.week4.calls
  accumulatedTotal.week3.digital =
    contactGoals.week3.digital + accumulatedTotal.week4.digital

  accumulatedTotal.week2.doorKnocking =
    contactGoals.week2.doorKnocking + accumulatedTotal.week3.doorKnocking
  accumulatedTotal.week2.calls =
    contactGoals.week2.calls + accumulatedTotal.week3.calls
  accumulatedTotal.week2.digital =
    contactGoals.week2.digital + accumulatedTotal.week3.digital

  accumulatedTotal.week1.doorKnocking =
    contactGoals.week1.doorKnocking + accumulatedTotal.week2.doorKnocking
  accumulatedTotal.week1.calls =
    contactGoals.week1.calls + accumulatedTotal.week2.calls
  accumulatedTotal.week1.digital =
    contactGoals.week1.digital + accumulatedTotal.week2.digital

  return accumulatedTotal
}

export const getVoterContactsGoal = ({
  voterContactGoal,
  voteGoal,
}: PathToVictoryGoals): number =>
  parseInt(String(voterContactGoal ?? (voteGoal ?? 0) * 5), 10)

export const getVoterContactsTotal = ({
  doorKnocking,
  calls,
  digital,
  directMail,
  digitalAds,
  text,
  events,
  robocall,
  phoneBanking,
  socialMedia,
}: ReportedVoterGoals): number =>
  (doorKnocking || 0) +
  (calls || 0) +
  (digital || 0) +
  (directMail || 0) +
  (digitalAds || 0) +
  (text || 0) +
  (events || 0) +
  (robocall || 0) +
  (phoneBanking || 0) +
  (socialMedia || 0)

export interface VoterContactCounts {
  needed: number
  contacted: number
}

export const calculateVoterContactCounts = (
  pathToVictory: PathToVictoryGoals | undefined,
  reportedVoterGoals: ReportedVoterGoals | undefined,
): VoterContactCounts => {
  return {
    needed: getVoterContactsGoal(pathToVictory || {}),
    contacted: getVoterContactsTotal(reportedVoterGoals || {}),
  }
}
