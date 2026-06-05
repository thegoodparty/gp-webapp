'use client'

import { ChevronDown, Clock, DollarSign, Info } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@styleguide'
import { numberFormatter } from 'helpers/numberHelper'
import type { Campaign } from 'helpers/types'
import {
  computeBudget,
  MAIL_COST_PER_PIECE,
  resolveVoterContactGoal,
  type BudgetComputation,
} from './budget'
import {
  type CampaignHours,
  computeCampaignHours,
  CONTACTS_PER_VOLUNTEER_HOUR,
  resolveWeeksRemaining,
} from './volunteerHours'

interface OutreachPlanStepProps {
  campaign: Campaign | null
}

const formatCurrency = (value: number): string =>
  `$${numberFormatter(Math.round(value))}`

const formatHours = (value: number): string =>
  `${numberFormatter(Math.round(value))} hrs`

export const computeWeeksRemaining = (electionDate?: string | null): number =>
  resolveWeeksRemaining(electionDate)

interface ResourcesComputation extends BudgetComputation, CampaignHours {
  filingRequirementsText: string | null
}

const computeResources = (
  voterContactGoal: number,
  projectedTurnout: number,
  weeksRemaining: number,
  filingFee: number | null,
  filingRequirementsText: string | null,
): ResourcesComputation => {
  const budget = computeBudget(voterContactGoal, projectedTurnout, filingFee)
  const hours = computeCampaignHours(voterContactGoal, weeksRemaining)

  return {
    ...budget,
    ...hours,
    filingRequirementsText,
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
      Based on a {resources.weeksRemaining}-week campaign. Your campaign plan
      uses this same formula, so the numbers will match.
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
        label="Literature"
        value={formatCurrency(resources.literatureCost)}
        hint={`${numberFormatter(
          resources.literaturePacks,
        )} packs of 250 — door hangers or palm cards`}
      />
      <BreakdownRow
        label="Direct mail"
        value={formatCurrency(resources.mailCost)}
        hint={`${numberFormatter(
          resources.mailCount,
        )} pieces × $${MAIL_COST_PER_PIECE}`}
      />
      <BreakdownRow label="Yard signs" value={formatCurrency(resources.yardSignsCost)} hint="50 signs" />
      <FilingFeeRow
        filingFee={resources.filingFee}
        filingFeeIsDefault={resources.filingFeeIsDefault}
        filingRequirementsText={resources.filingRequirementsText}
      />
      <BreakdownRow
        label="Contingency (5%)"
        value={formatCurrency(resources.contingency)}
        hint="Reserve for last-week opportunities."
      />
    </ul>
  </ResourceAccordion>
)

interface FilingFeeRowProps {
  filingFee: number
  filingFeeIsDefault: boolean
  filingRequirementsText: string | null
}

const FilingFeeRow = ({
  filingFee,
  filingFeeIsDefault,
  filingRequirementsText,
}: FilingFeeRowProps): React.JSX.Element => {
  const hasRawText =
    filingRequirementsText !== null && filingRequirementsText.trim() !== ''
  const value = formatCurrency(filingFee)
  const hintLabel = filingFeeIsDefault
    ? 'Estimated $100 default. Replaced with the BallotReady value once available.'
    : 'Estimated. Filing fees come from BallotReady.'

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
        value={formatHours(resources.candidateHours)}
        hint={`${resources.candidateHoursPerWeek} hours per week for the ${resources.weeksRemaining} weeks remaining.`}
      />
      <BreakdownRow
        label="Volunteers"
        value={formatHours(resources.volunteerHours)}
        hint={`Assuming ${CONTACTS_PER_VOLUNTEER_HOUR} voter contact attempts per hour to get to your total door knocking goals.`}
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
  const voterContactGoal = resolveVoterContactGoal(
    metrics?.voterContactGoal,
    winNumber,
  )

  if (voterContactGoal <= 0) {
    return <ResourcesUnavailable />
  }

  const weeksRemaining = computeWeeksRemaining(campaign?.details?.electionDate)
  const resources = computeResources(
    voterContactGoal,
    projectedTurnout,
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
