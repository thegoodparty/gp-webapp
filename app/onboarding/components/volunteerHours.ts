// Campaign time formula — the single source of truth for volunteer and
// candidate hours, shared by the onboarding outreach step, the campaign plan,
// and the plan PDF. Budget dollars live in ./budget.
import { DOORS_PERCENT } from './budget'

// Door knocking covers DOORS_PERCENT of the voter contact goal. A volunteer
// is assumed to make this many door-knock attempts per hour.
export const CONTACTS_PER_VOLUNTEER_HOUR = 10
// The candidate is assumed to put in this many hours every remaining week.
export const CANDIDATE_HOURS_PER_WEEK = 14
// Fallback when the election date is missing, invalid, or already passed.
export const DEFAULT_WEEKS_REMAINING = 12

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

// Actual whole weeks until the election, rounded up. Falls back to
// DEFAULT_WEEKS_REMAINING when the date is missing, invalid, or in the past.
export const resolveWeeksRemaining = (
  electionDate: Date | string | null | undefined,
): number => {
  if (!electionDate) return DEFAULT_WEEKS_REMAINING
  const election =
    electionDate instanceof Date ? electionDate : new Date(electionDate)
  if (Number.isNaN(election.getTime())) return DEFAULT_WEEKS_REMAINING
  const ms = election.getTime() - Date.now()
  if (ms <= 0) return DEFAULT_WEEKS_REMAINING
  return Math.ceil(ms / ONE_WEEK_MS)
}

export interface CampaignHours {
  doorGoal: number
  volunteerHours: number
  candidateHoursPerWeek: number
  candidateHours: number
  weeksRemaining: number
  totalHours: number
}

// Volunteer hours cover the door-knocking goal (the candidate is assumed to
// do none); candidate hours are a flat weekly commitment over the weeks left.
export const computeCampaignHours = (
  contactGoal: number,
  weeksRemaining: number,
): CampaignHours => {
  const doorGoal = Math.round(contactGoal * DOORS_PERCENT)
  const volunteerHours = Math.ceil(doorGoal / CONTACTS_PER_VOLUNTEER_HOUR)
  const candidateHours = CANDIDATE_HOURS_PER_WEEK * weeksRemaining
  return {
    doorGoal,
    volunteerHours,
    candidateHoursPerWeek: CANDIDATE_HOURS_PER_WEEK,
    candidateHours,
    weeksRemaining,
    totalHours: volunteerHours + candidateHours,
  }
}
