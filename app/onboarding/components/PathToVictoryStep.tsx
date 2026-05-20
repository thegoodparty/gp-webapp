'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@styleguide'
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

const WIN_NUMBER_RANGE_PCT = 0.15
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
    className={`flex items-center gap-3 rounded-lg border bg-base-surface px-4 py-3 transition-opacity ${
      isChecked
        ? 'border-base-border opacity-100'
        : 'border-base-border opacity-60'
    }`}
  >
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
        isChecked ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
      }`}
    >
      <Check className="size-4" aria-hidden="true" />
    </span>
    <span className="text-sm leading-6 text-foreground">{text}</span>
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
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-100 text-components-input-active">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <div className="space-y-2">
        <h2 className="text-2xl leading-8 font-bold text-foreground">
          Building your path to victory
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Crunching real voter data for{' '}
          <span className="font-semibold text-foreground">{officeName}</span>
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
  <div className="rounded-lg border border-base-border bg-muted p-6 text-center">
    <p className="text-sm leading-6 text-foreground">
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
}: WinNumberHeroCardProps): React.JSX.Element => {
  const lowEstimate = Math.max(
    0,
    Math.round(winNumber * (1 - WIN_NUMBER_RANGE_PCT)),
  )
  const highEstimate = Math.round(winNumber * (1 + WIN_NUMBER_RANGE_PCT))

  return (
    <Card className="overflow-hidden rounded-2xl border-blue-100 bg-linear-to-b from-blue-50 to-white shadow-none">
      <CardContent className="space-y-2 p-8 text-center">
        <p className="text-6xl leading-none font-bold text-foreground sm:text-7xl">
          {numberFormatter(winNumber)}
        </p>
        <p className="text-xs font-semibold tracking-widest text-components-input-active uppercase">
          Projected votes needed to win
        </p>
        <p className="text-base font-semibold text-foreground">{officeName}</p>
        <p className="pt-2 text-xs text-muted-foreground">
          Projected range:{' '}
          <span className="font-semibold">
            {numberFormatter(lowEstimate)}–{numberFormatter(highEstimate)}
          </span>{' '}
          (~95% confidence)
        </p>
      </CardContent>
    </Card>
  )
}

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
  <li className="flex items-start gap-4 rounded-xl border border-base-border p-4">
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold bg-blue-50 text-components-input-active">
      {index}
    </span>
    <div className="flex-1">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <span className="text-base font-semibold text-foreground">{value}</span>
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
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Here&apos;s how our projections work:
        </p>
        <Dialog>
          <DialogTrigger className="cursor-pointer text-sm text-muted-foreground underline-offset-4 hover:underline">
            Methodology
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Methodology</DialogTitle>
            </DialogHeader>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Our turnout projections are built on a national voter file
                  covering more than 240 million voters and over 130,000
                  elections each year.
                </p>
                <p>
                  We analyze voter eligibility, historical voting behavior and
                  election patterns to estimate the likelihood that each voter
                  in your district will turn out in your race. Combining the
                  voter-level predictions, we generate an accurate turnout
                  projection and win number target tailored specifically to your
                  election.
                </p>
                <p>
                  In 2025, the model&rsquo;s predictions were calibrated within
                  approximately 1.5 percentage points of actual voter turnout
                  behavior on average. For more information, see{' '}
                  <a
                    href="https://goodparty.org/blog/article/calculate-win-numbers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-components-input-active hover:underline"
                  >
                    our blog post
                  </a>
                  {'.'}
                </p>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
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
          title="Projected votes needed to win"
          description="A simple majority of voters (50% + 1) who actually cast a ballot."
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
