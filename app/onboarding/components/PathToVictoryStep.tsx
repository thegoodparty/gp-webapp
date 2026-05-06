'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@styleguide'
import { clientRequest } from 'gpApi/typed-request'
import { numberFormatter } from 'helpers/numberHelper'
import { reportErrorToSentry } from '@shared/sentry'
import type { Campaign } from 'helpers/types'

const OFFICE_TEMPLATE_TOKEN = '{office}'
const DEFAULT_OFFICE_NAME = 'your office'
const CONTACTS_STATS_ROUTE = 'GET /v1/contacts/stats'
const SENTRY_CONTEXT_FETCH_CONTACTS_STATS =
  'onboarding.pathToVictory.fetchContactsStats'

const CHECKLIST_ITEMS = [
  `Gathering voter information for ${OFFICE_TEMPLATE_TOKEN}`,
  'Assembling the issues your voters care most about',
  'Looking at historical voter turnout',
  'Calculating the votes you need to win',
] as const

const REVEAL_INTERVAL_MS = 700
const RESULTS_HOLD_MS = 600

const METRICS_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const
type MetricsStatus = (typeof METRICS_STATUS)[keyof typeof METRICS_STATUS]

const METRICS_ERROR_REASON = {
  MISSING_TURNOUT: 'missing_turnout',
  UPSTREAM_ERROR: 'upstream_error',
} as const
type MetricsErrorReason =
  (typeof METRICS_ERROR_REASON)[keyof typeof METRICS_ERROR_REASON]

type MetricsResolution =
  | {
      status: typeof METRICS_STATUS.SUCCESS
      winNumber: number
      projectedTurnout: number
      totalRegisteredVoters: number | null
    }
  | { status: typeof METRICS_STATUS.ERROR; reason: MetricsErrorReason }

interface PathToVictoryStepProps {
  campaign: Campaign | null
  officeName?: string | null
  onLoadingChange?: (isLoading: boolean) => void
  onMetricsResolved?: (result: MetricsResolution) => void
  skipReveal?: boolean
}

const formatOfficeName = (campaign: Campaign | null): string =>
  campaign?.positionName ||
  campaign?.organization?.customPositionName ||
  campaign?.office ||
  DEFAULT_OFFICE_NAME

const useRegisteredVoters = (campaignId: number | undefined) => {
  const [registeredVoters, setRegisteredVoters] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    clientRequest(CONTACTS_STATS_ROUTE, {})
      .then((res) => {
        if (cancelled) return
        setRegisteredVoters(res.data?.totalConstituents ?? null)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setRegisteredVoters(null)
        reportErrorToSentry(error, {
          context: SENTRY_CONTEXT_FETCH_CONTACTS_STATS,
          campaignId,
        })
      })
    return () => {
      cancelled = true
    }
  }, [campaignId])

  return registeredVoters
}

const useChecklistReveal = (skipReveal: boolean) => {
  const [revealedCount, setRevealedCount] = useState(
    skipReveal ? CHECKLIST_ITEMS.length : 0,
  )
  const [showResults, setShowResults] = useState(skipReveal)

  useEffect(() => {
    if (skipReveal) return
    if (revealedCount >= CHECKLIST_ITEMS.length) return
    const id = setTimeout(
      () => setRevealedCount((prev) => prev + 1),
      REVEAL_INTERVAL_MS,
    )
    return () => clearTimeout(id)
  }, [revealedCount, skipReveal])

  useEffect(() => {
    if (skipReveal) return
    if (revealedCount < CHECKLIST_ITEMS.length) return
    const id = setTimeout(() => setShowResults(true), RESULTS_HOLD_MS)
    return () => clearTimeout(id)
  }, [revealedCount, skipReveal])

  return { revealedCount, showResults }
}

interface ResolveMetricsArgs {
  showResults: boolean
  metrics: Campaign['raceTargetMetrics'] | null
  winNumber: number
  projectedTurnout: number
  registeredVoters: number | null
  onMetricsResolved?: (result: MetricsResolution) => void
}

const useReportMetricsResolution = ({
  showResults,
  metrics,
  winNumber,
  projectedTurnout,
  registeredVoters,
  onMetricsResolved,
}: ResolveMetricsArgs) => {
  const statusRef = useRef<MetricsStatus | null>(null)

  useEffect(() => {
    if (!showResults) return
    if (statusRef.current === METRICS_STATUS.SUCCESS) return

    if (!metrics || winNumber <= 0) {
      if (statusRef.current === METRICS_STATUS.ERROR) return
      statusRef.current = METRICS_STATUS.ERROR
      onMetricsResolved?.({
        status: METRICS_STATUS.ERROR,
        reason: !metrics
          ? METRICS_ERROR_REASON.UPSTREAM_ERROR
          : METRICS_ERROR_REASON.MISSING_TURNOUT,
      })
      return
    }

    statusRef.current = METRICS_STATUS.SUCCESS
    onMetricsResolved?.({
      status: METRICS_STATUS.SUCCESS,
      winNumber,
      projectedTurnout,
      totalRegisteredVoters: registeredVoters,
    })
  }, [
    showResults,
    metrics,
    winNumber,
    projectedTurnout,
    registeredVoters,
    onMetricsResolved,
  ])
}

interface ChecklistItemProps {
  text: string
  isChecked: boolean
}

const ChecklistItem = ({
  text,
  isChecked,
}: ChecklistItemProps): React.JSX.Element => (
  <li
    className={`flex items-center gap-3 rounded-lg border bg-white px-4 py-3 transition-opacity ${
      isChecked ? 'border-slate-200 opacity-100' : 'border-slate-100 opacity-60'
    }`}
  >
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
        isChecked ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300'
      }`}
    >
      <Check className="size-4" aria-hidden="true" />
    </span>
    <span className="text-sm leading-6 text-slate-700">{text}</span>
  </li>
)

interface BuildingPathToVictoryProps {
  officeName: string
  revealedCount: number
}

const BuildingPathToVictory = ({
  officeName,
  revealedCount,
}: BuildingPathToVictoryProps): React.JSX.Element => (
  <Card className="mx-auto max-w-2xl rounded-2xl border-blue-100 bg-linear-to-b from-blue-50 to-white shadow-none">
    <CardContent className="space-y-6 p-8 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <div className="space-y-2">
        <h2 className="text-2xl leading-8 font-bold text-slate-950">
          Building your path to victory
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          Crunching real voter data for{' '}
          <span className="font-semibold text-slate-950">{officeName}</span>
        </p>
      </div>
      <ul className="space-y-3 text-left">
        {CHECKLIST_ITEMS.map((template, index) => (
          <ChecklistItem
            key={template}
            text={template.replace(OFFICE_TEMPLATE_TOKEN, officeName)}
            isChecked={index < revealedCount}
          />
        ))}
      </ul>
    </CardContent>
  </Card>
)

const MetricsUnavailable = (): React.JSX.Element => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
    <p className="text-sm leading-6 text-slate-700">
      We couldn&apos;t calculate vote projections for your district yet.
      We&apos;ll keep working on it in the background.
    </p>
  </div>
)

interface WinNumberHeroCardProps {
  winNumber: number
  officeName: string
}

const WinNumberHeroCard = ({
  winNumber,
  officeName,
}: WinNumberHeroCardProps): React.JSX.Element => (
  <Card className="overflow-hidden rounded-2xl border-blue-100 bg-linear-to-b from-blue-50 to-white shadow-none">
    <CardContent className="space-y-2 p-8 text-center">
      <p className="text-6xl leading-none font-bold text-slate-950 sm:text-7xl">
        {numberFormatter(winNumber)}
      </p>
      <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
        Votes needed to win
      </p>
      <p className="text-base font-semibold text-slate-950">{officeName}</p>
      <p className="pt-2 text-xs text-slate-500">
        *Depending on the election&apos;s turnout
      </p>
    </CardContent>
  </Card>
)

interface ProjectionStepProps {
  index: number
  title: string
  description: string
  value: string
}

const ProjectionStep = ({
  index,
  title,
  description,
  value,
}: ProjectionStepProps): React.JSX.Element => (
  <li className="flex items-start gap-4 rounded-xl border border-slate-200 p-4">
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
      {index}
    </span>
    <div className="flex-1">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    <span className="text-base font-bold text-slate-950">{value}</span>
  </li>
)

interface ProjectionExplanationProps {
  registeredVoters: number | null
  projectedTurnout: number
  winNumber: number
}

const ProjectionExplanation = ({
  registeredVoters,
  projectedTurnout,
  winNumber,
}: ProjectionExplanationProps): React.JSX.Element => {
  const showRegisteredVoters = registeredVoters !== null && registeredVoters > 0
  let stepIndex = 1

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-slate-500">
        Here&apos;s how our projections work:
      </p>
      <ol className="space-y-3">
        {showRegisteredVoters ? (
          <ProjectionStep
            index={stepIndex++}
            title="Registered voters in your district"
            description="The total pool of voters eligible to cast a ballot in your race."
            value={numberFormatter(registeredVoters)}
          />
        ) : null}
        <ProjectionStep
          index={stepIndex++}
          title="Projected voter turnout"
          description="The number of voters we expect to cast a ballot based on similar past elections."
          value={numberFormatter(projectedTurnout)}
        />
        <ProjectionStep
          index={stepIndex++}
          title="Projected votes needed to win (50% + 1)"
          description="A simple majority of voters who actually cast a ballot."
          value={numberFormatter(winNumber)}
        />
      </ol>
    </div>
  )
}

export const PathToVictoryStep = ({
  campaign,
  officeName: officeNameProp,
  onLoadingChange,
  onMetricsResolved,
  skipReveal = false,
}: PathToVictoryStepProps): React.JSX.Element => {
  const registeredVoters = useRegisteredVoters(campaign?.id)
  const { revealedCount, showResults } = useChecklistReveal(skipReveal)

  const officeName = officeNameProp || formatOfficeName(campaign)
  const metrics = campaign?.raceTargetMetrics ?? null
  const winNumber = metrics?.winNumber ?? 0
  const projectedTurnout = metrics?.projectedTurnout ?? 0

  useEffect(() => {
    onLoadingChange?.(!showResults)
  }, [showResults, onLoadingChange])

  useReportMetricsResolution({
    showResults,
    metrics,
    winNumber,
    projectedTurnout,
    registeredVoters,
    onMetricsResolved,
  })

  if (!showResults) {
    return (
      <BuildingPathToVictory
        officeName={officeName}
        revealedCount={revealedCount}
      />
    )
  }

  if (!metrics || winNumber <= 0) {
    return <MetricsUnavailable />
  }

  return (
    <div className="space-y-6 text-left">
      <WinNumberHeroCard winNumber={winNumber} officeName={officeName} />
      <ProjectionExplanation
        registeredVoters={registeredVoters}
        projectedTurnout={projectedTurnout}
        winNumber={winNumber}
      />
    </div>
  )
}
