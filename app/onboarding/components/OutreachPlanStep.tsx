'use client'

import { ChevronDown, Clock, DollarSign } from 'lucide-react'
import { numberFormatter } from 'helpers/numberHelper'
import type { Campaign } from 'helpers/types'

const VOTER_CONTACT_MULTIPLIER = 5
const DOORS_PERCENT = 0.2
const ROBOCALL_COST = 0.045
const TEXT_COST = 0.035
const DOORS_PER_HOUR = 15
const VOLUNTEER_HOURS_PER_WEEK = 3
const CANDIDATE_HOURS_PER_WEEK = 14
// Cap the active campaign window at 12 weeks. Anything past this point counts
// as "still in the prep window" — the plan assumes a final 12-week sprint.
const MAX_CAMPAIGN_WEEKS = 12
const FALLBACK_WEEKS_REMAINING = MAX_CAMPAIGN_WEEKS

// Budget breakdown constants. Mirrors `buildBudgetBreakdown` in
// planContent.ts (success-page plan). Tweak both in lockstep.
const FILING_FEE = 100
const YARD_SIGNS_COST = 385
const PALM_CARDS_COST = 67
const TEXT_CAMPAIGN_COUNT = 4
const ROBOCALL_CAMPAIGN_COUNT = 3
const CONTINGENCY_RATE = 0.05
// Placeholder match rates used to derive registered-voter-with-phone counts
// from projected turnout. Same formula as planContent.ts.
const MATCH_RATE_CELL = 0.65
const MATCH_RATE_LANDLINE = 0.35
const CELL_REGISTRATION_MULTIPLIER = 4
const LANDLINE_REGISTRATION_MULTIPLIER = 2

interface OutreachPlanStepProps {
  campaign: Campaign | null
}

const formatCurrency = (value: number): string =>
  `$${numberFormatter(Math.round(value))}`

const formatHours = (value: number): string =>
  `${numberFormatter(Math.round(value))} hrs`

export const computeWeeksRemaining = (electionDate?: string | null): number => {
  if (!electionDate) return FALLBACK_WEEKS_REMAINING
  const election = new Date(electionDate)
  if (Number.isNaN(election.getTime())) return FALLBACK_WEEKS_REMAINING
  const ms = election.getTime() - Date.now()
  if (ms <= 0) return FALLBACK_WEEKS_REMAINING
  const weeks = Math.ceil(ms / (7 * 24 * 60 * 60 * 1000))
  return Math.min(weeks, MAX_CAMPAIGN_WEEKS)
}

interface ResourcesComputation {
  filingCost: number
  yardSignsCost: number
  palmCardsCost: number
  matchedCellRecords: number
  matchedLandlineRecords: number
  textCampaignsCost: number
  robocallCampaignsCost: number
  contingencyCost: number
  totalBudget: number
  candidateHoursPerWeek: number
  volunteersPerWeek: number
  volunteerHoursPerWeek: number
  totalHoursPerWeek: number
  weeksRemaining: number
  totalHours: number
}

const computeResources = (
  voterContactGoal: number,
  weeksRemaining: number,
  projectedTurnout: number,
): ResourcesComputation => {
  // Volunteers needed each week:
  //   doors_to_knock = voterContactGoal × DOORS_PERCENT
  //   volunteers/week = doors_to_knock / (doors_per_hr × vol_hrs_week × weeks)
  // Each volunteer covers (doors_per_hr × vol_hrs_week × weeks) doors over
  // the campaign; this many running concurrently each week clears the total.
  const totalDoors = Math.round(voterContactGoal * DOORS_PERCENT)
  const doorsPerVolunteerOverCampaign =
    DOORS_PER_HOUR * VOLUNTEER_HOURS_PER_WEEK * weeksRemaining
  const volunteersPerWeek =
    doorsPerVolunteerOverCampaign > 0
      ? Math.ceil(totalDoors / doorsPerVolunteerOverCampaign)
      : 0

  const matchedCellRecords = Math.max(
    0,
    Math.round(
      projectedTurnout * MATCH_RATE_CELL * CELL_REGISTRATION_MULTIPLIER,
    ),
  )
  const matchedLandlineRecords = Math.max(
    0,
    Math.round(
      projectedTurnout *
        MATCH_RATE_LANDLINE *
        LANDLINE_REGISTRATION_MULTIPLIER,
    ),
  )

  const filingCost = FILING_FEE
  const yardSignsCost = YARD_SIGNS_COST
  const palmCardsCost = PALM_CARDS_COST
  const textCampaignsCost =
    TEXT_CAMPAIGN_COUNT * matchedCellRecords * TEXT_COST
  const robocallCampaignsCost =
    ROBOCALL_CAMPAIGN_COUNT * matchedLandlineRecords * ROBOCALL_COST
  const subtotal =
    filingCost +
    yardSignsCost +
    palmCardsCost +
    textCampaignsCost +
    robocallCampaignsCost
  const contingencyCost = subtotal * CONTINGENCY_RATE
  const totalBudget = Math.round(subtotal + contingencyCost)

  const volunteerHoursPerWeek = volunteersPerWeek * VOLUNTEER_HOURS_PER_WEEK

  return {
    filingCost,
    yardSignsCost,
    palmCardsCost,
    matchedCellRecords,
    matchedLandlineRecords,
    textCampaignsCost,
    robocallCampaignsCost,
    contingencyCost,
    totalBudget,
    candidateHoursPerWeek: CANDIDATE_HOURS_PER_WEEK,
    volunteersPerWeek,
    volunteerHoursPerWeek,
    totalHoursPerWeek: CANDIDATE_HOURS_PER_WEEK + volunteerHoursPerWeek,
    weeksRemaining,
    totalHours:
      (CANDIDATE_HOURS_PER_WEEK + volunteerHoursPerWeek) * weeksRemaining,
  }
}

interface ResourceAccordionProps {
  label: string
  sublabel?: string
  total: string
  icon: React.ReactNode
  children: React.ReactNode
}

const ResourceAccordion = ({
  label,
  sublabel,
  total,
  icon,
  children,
}: ResourceAccordionProps): React.JSX.Element => (
  <details className="group overflow-hidden rounded-xl border border-base-border bg-base-surface">
    <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 list-none transition-colors hover:bg-accent [&::-webkit-details-marker]:hidden">
      <span className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
          {icon}
        </span>
        <span className="flex flex-col">
          <span className="text-base font-semibold text-foreground">
            {label}
          </span>
          {sublabel ? (
            <span className="text-xs text-muted-foreground">{sublabel}</span>
          ) : null}
        </span>
      </span>
      <span className="flex items-center gap-3">
        <span className="text-base font-semibold text-foreground">{total}</span>
        <ChevronDown
          className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </span>
    </summary>
    <div className="border-t border-base-border">{children}</div>
  </details>
)

interface BreakdownRowProps {
  label: string
  value: string
  hint?: React.ReactNode
}

const BreakdownRow = ({
  label,
  value,
  hint,
}: BreakdownRowProps): React.JSX.Element => (
  <li className="flex w-full items-start justify-between gap-4 px-5 py-4 text-sm">
    <div>
      <p className="font-medium text-foreground">{label}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
    <span className="font-semibold whitespace-nowrap text-foreground">
      {value}
    </span>
  </li>
)

interface BudgetAccordionProps {
  resources: ResourcesComputation
}

const BudgetAccordion = ({
  resources,
}: BudgetAccordionProps): React.JSX.Element => (
  <ResourceAccordion
    label="Total budget"
    sublabel="For voter outreach, compliance, and fees"
    total={formatCurrency(resources.totalBudget)}
    icon={<DollarSign className="size-5" aria-hidden="true" />}
  >
    <p className="px-5 pt-4 text-xs text-muted-foreground">
      Based on a {resources.weeksRemaining}-week campaign.
    </p>
    <ul className="divide-y divide-base-border p-0 m-0">
      <BreakdownRow
        label="Filing fees"
        value={formatCurrency(resources.filingCost)}
        hint="Nomination papers, any mandatory state/local filings."
      />
      <BreakdownRow
        label="Yard signs"
        value={formatCurrency(resources.yardSignsCost)}
        hint="Core visibility in a small precinct; estimated 50 yard signs for $385."
      />
      <BreakdownRow
        label="Palm cards"
        value={formatCurrency(resources.palmCardsCost)}
        hint="Handoffs at events and passive drops; estimated 250 palm cards for $67."
      />
      <BreakdownRow
        label="Text campaigns"
        value={formatCurrency(resources.textCampaignsCost)}
        hint={`${TEXT_CAMPAIGN_COUNT} text campaigns to ${numberFormatter(
          resources.matchedCellRecords,
        )} at $${TEXT_COST.toFixed(3)} per text.`}
      />
      <BreakdownRow
        label="Robocall campaigns"
        value={formatCurrency(resources.robocallCampaignsCost)}
        hint={`${ROBOCALL_CAMPAIGN_COUNT} robocall campaigns to ${numberFormatter(
          resources.matchedLandlineRecords,
        )} at $${ROBOCALL_COST.toFixed(3)} per call.`}
      />
      <BreakdownRow
        label="Contingency (5%)"
        value={formatCurrency(resources.contingencyCost)}
        hint="Reserve for last-week opportunities."
      />
    </ul>
  </ResourceAccordion>
)

interface TimeAccordionProps {
  resources: ResourcesComputation
}

const TimeAccordion = ({
  resources,
}: TimeAccordionProps): React.JSX.Element => (
  <ResourceAccordion
    label="Total time"
    sublabel="For in-person campaigning, events, and volunteers"
    total={formatHours(resources.totalHours)}
    icon={<Clock className="size-5" aria-hidden="true" />}
  >
    <p className="px-5 pt-4 text-xs text-muted-foreground">
      Based on a {resources.weeksRemaining}-week campaign.
    </p>
    <ul className="divide-y divide-base-border p-0 m-0">
      <BreakdownRow
        label="Your time"
        value={formatHours(
          resources.candidateHoursPerWeek * resources.weeksRemaining,
        )}
        hint={`${formatHours(
          resources.candidateHoursPerWeek,
        )} per week knocking doors and meeting voters in person.`}
      />
      <BreakdownRow
        label="Volunteers"
        value={formatHours(
          resources.volunteerHoursPerWeek * resources.weeksRemaining,
        )}
        hint={`${numberFormatter(resources.volunteersPerWeek)} ${
          resources.volunteersPerWeek === 1 ? 'volunteer' : 'volunteers'
        } x ${VOLUNTEER_HOURS_PER_WEEK}hr ${
          resources.volunteersPerWeek === 1 ? 'shift' : 'shifts'
        } per week.`}
      />
    </ul>
  </ResourceAccordion>
)

const ResourcesUnavailable = (): React.JSX.Element => (
  <div className="rounded-lg border border-base-border bg-muted p-6 text-center">
    <p className="text-sm leading-6 text-foreground">
      We couldn&apos;t calculate your minimum resources yet. We&apos;ll keep
      working on it in the background.
    </p>
  </div>
)

export const OutreachPlanStep = ({
  campaign,
}: OutreachPlanStepProps): React.JSX.Element => {
  const metrics = campaign?.raceTargetMetrics ?? null
  const winNumber = metrics?.winNumber ?? 0
  const projectedTurnout = metrics?.projectedTurnout ?? 0
  const voterContactGoal =
    metrics?.voterContactGoal ?? winNumber * VOTER_CONTACT_MULTIPLIER

  if (voterContactGoal <= 0) {
    return <ResourcesUnavailable />
  }

  const weeksRemaining = computeWeeksRemaining(campaign?.details?.electionDate)
  const resources = computeResources(
    voterContactGoal,
    weeksRemaining,
    projectedTurnout,
  )

  return (
    <div className="flex w-full flex-col items-stretch gap-4 text-left">
      <BudgetAccordion resources={resources} />
      <TimeAccordion resources={resources} />
    </div>
  )
}
