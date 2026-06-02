'use client'

import { ChevronDown, Clock, DollarSign, Info } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@styleguide'
import { numberFormatter } from 'helpers/numberHelper'
import type { Campaign } from 'helpers/types'

const VOTER_CONTACT_MULTIPLIER = 5
const DOORS_PERCENT = 0.2
const ROBOCALLS_PERCENT = 0.2
const TEXTS_PERCENT = 0.6
const ROBOCALL_COST = 0.045
const TEXT_COST = 0.035
const DOORS_PER_HOUR = 15
const VOLUNTEER_HOURS_PER_WEEK = 3
const CANDIDATE_HOURS_PER_WEEK = 14
// Cap the active campaign window at 12 weeks. Anything past this point counts
// as "still in the prep window" — the plan assumes a final 12-week sprint.
const MAX_CAMPAIGN_WEEKS = 12
const FALLBACK_WEEKS_REMAINING = MAX_CAMPAIGN_WEEKS

/**
 * Budget channel benchmarks — first-stab values for researcher review.
 * Each rate is a midpoint of public sources; tighten or tier these once
 * GoodParty.org strategy has a preferred number.
 *
 * Direct mail
 *   MAIL_UNIVERSE_RATE: real mail goes to a persuadable subset of the voter-
 *   contact universe, not all of it. 40% is a midpoint between high-prop
 *   targeting (~25%) and full-universe (~60%).
 *   MAIL_COST_PER_PIECE: $0.55 = midpoint of $0.50–$0.70 typical bulk political
 *   postcards (printing + postage). Drops to ~$0.32 at 50k+ pieces.
 *   https://suttonsmart.com/political-mailers/budgeting-cost-management/political-mailer-pricing-guide/
 *   https://www.thecampaignworkshop.com/blog/political-direct-mail/political-direct-mail
 *
 * Yard signs & literature
 *   SIGNS_PER_CONTACT_DENOMINATOR: 1 sign per 100 voter contacts. Calibrated so
 *   a ~10k voter-contact race lands near 100 signs. May be too few for
 *   sprawling rural districts or too many for dense urban ones.
 *   SIGN_COST: $5 = mid-bulk price for an 18×24" coroplast sign (sign + stake).
 *   DOOR_HANGER_COST: $0.20/piece = bulk printing midpoint. Quantity reuses the
 *   already-computed `totalDoors` so it tracks the canvassing plan.
 *   https://www.thecampaignworkshop.com/yard-sign-calculator-learn-what-campaign-signs-cost
 *   https://www.doorhangerswork.com/door-hanger-distribution-cost/
 *
 * Compliance & filing fees
 *   Sourced live from BallotReady via election-api on
 *   `campaign.raceTargetMetrics.filingFee` (+ raw text in
 *   `filingRequirementsText`). `null` when BR returns multiple amounts in one
 *   row, has no data, or the regex can't extract a clean number — in those
 *   cases the row shows "—" and the popover surfaces the raw BR string.
 */
const MAIL_UNIVERSE_RATE = 0.4
const MAIL_COST_PER_PIECE = 0.55
const SIGNS_PER_CONTACT_DENOMINATOR = 100
const SIGN_COST = 5
const DOOR_HANGER_COST = 0.2

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
  textCount: number
  textCost: number
  robocallCount: number
  robocallCost: number
  mailCount: number
  mailCost: number
  signCount: number
  doorHangerCount: number
  yardLitCost: number
  filingFee: number | null
  filingRequirementsText: string | null
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
  filingFee: number | null,
  filingRequirementsText: string | null,
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

  const textCount = Math.round(voterContactGoal * TEXTS_PERCENT)
  const textCost = textCount * TEXT_COST
  const robocallCount = Math.round(voterContactGoal * ROBOCALLS_PERCENT)
  const robocallCost = robocallCount * ROBOCALL_COST

  const mailCount = Math.round(voterContactGoal * MAIL_UNIVERSE_RATE)
  const mailCost = mailCount * MAIL_COST_PER_PIECE

  const signCount = Math.max(
    0,
    Math.ceil(voterContactGoal / SIGNS_PER_CONTACT_DENOMINATOR),
  )
  const doorHangerCount = totalDoors
  const yardLitCost = signCount * SIGN_COST + doorHangerCount * DOOR_HANGER_COST

  const volunteerHoursPerWeek = volunteersPerWeek * VOLUNTEER_HOURS_PER_WEEK

  return {
    textCount,
    textCost,
    robocallCount,
    robocallCost,
    mailCount,
    mailCost,
    signCount,
    doorHangerCount,
    yardLitCost,
    filingFee,
    filingRequirementsText,
    totalBudget:
      textCost + robocallCost + mailCost + yardLitCost + (filingFee ?? 0),
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
    label="Estimated budget"
    sublabel="A preliminary projection — your campaign plan refines this with real voter data"
    total={formatCurrency(resources.totalBudget)}
    icon={<DollarSign className="size-5" aria-hidden="true" />}
  >
    <p className="px-5 pt-4 text-xs text-muted-foreground">
      Based on a {resources.weeksRemaining}-week campaign. The final
      &ldquo;Recommended Budget&rdquo; in your campaign plan uses actual
      phone-match counts from the voter file, so it may differ from this
      estimate.
    </p>
    <ul className="divide-y divide-base-border p-0 m-0">
      <BreakdownRow
        label="Text messages"
        value={formatCurrency(resources.textCost)}
        hint={`${numberFormatter(resources.textCount)} messages × 3.5¢`}
      />
      <BreakdownRow
        label="Robocalls"
        value={formatCurrency(resources.robocallCost)}
        hint={`${numberFormatter(resources.robocallCount)} calls × 4.5¢`}
      />
      <BreakdownRow
        label="Direct mail"
        value={formatCurrency(resources.mailCost)}
        hint={`${numberFormatter(
          resources.mailCount,
        )} pieces × $${MAIL_COST_PER_PIECE}`}
      />
      <BreakdownRow
        label="Yard signs & literature"
        value={formatCurrency(resources.yardLitCost)}
        hint={`${numberFormatter(
          resources.signCount,
        )} signs + ${numberFormatter(resources.doorHangerCount)} door hangers`}
      />
      <FilingFeeRow
        filingFee={resources.filingFee}
        filingRequirementsText={resources.filingRequirementsText}
      />
    </ul>
  </ResourceAccordion>
)

interface FilingFeeRowProps {
  filingFee: number | null
  filingRequirementsText: string | null
}

const FilingFeeRow = ({
  filingFee,
  filingRequirementsText,
}: FilingFeeRowProps): React.JSX.Element => {
  const hasFee = filingFee !== null
  const hasRawText =
    filingRequirementsText !== null && filingRequirementsText.trim() !== ''
  const value = hasFee ? formatCurrency(filingFee) : '—'
  const hintLabel = hasFee
    ? 'Estimated. Filing fees come from BallotReady.'
    : hasRawText
    ? 'Filing fee varies. See BallotReady for the full text.'
    : 'No filing fee data for this race yet.'

  const hint = (
    <span className="inline-flex items-center gap-1">
      <span>{hintLabel}</span>
      {hasRawText ? (
        <Popover>
          <PopoverTrigger
            type="button"
            aria-label="See full text from BallotReady"
            className="text-muted-foreground hover:text-foreground"
          >
            <Info className="size-3.5" aria-hidden="true" />
          </PopoverTrigger>
          <PopoverContent className="max-w-sm text-xs">
            <p className="font-semibold text-foreground">From BallotReady</p>
            <p className="mt-1 whitespace-pre-line text-muted-foreground">
              {filingRequirementsText}
            </p>
          </PopoverContent>
        </Popover>
      ) : null}
    </span>
  )

  return <BreakdownRow label="Filing fee" value={value} hint={hint} />
}

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
  const voterContactGoal =
    metrics?.voterContactGoal ?? winNumber * VOTER_CONTACT_MULTIPLIER

  if (voterContactGoal <= 0) {
    return <ResourcesUnavailable />
  }

  const weeksRemaining = computeWeeksRemaining(campaign?.details?.electionDate)
  const resources = computeResources(
    voterContactGoal,
    weeksRemaining,
    metrics?.filingFee ?? null,
    metrics?.filingRequirementsText ?? null,
  )

  return (
    <div className="flex w-full flex-col items-stretch gap-4 text-left">
      <BudgetAccordion resources={resources} />
      <TimeAccordion resources={resources} />
    </div>
  )
}
