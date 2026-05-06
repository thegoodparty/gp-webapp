'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@styleguide'
import { clientRequest } from 'gpApi/typed-request'
import { numberFormatter } from 'helpers/numberHelper'
import { reportErrorToSentry } from '@shared/sentry'
import type { Campaign } from 'helpers/types'

const CHECKLIST_ITEMS = [
  'Gathering voter information for {office}',
  'Assembling the issues your voters care most about',
  'Looking at historical voter turnout',
  'Calculating the votes you need to win',
] as const

const REVEAL_INTERVAL_MS = 700
const RESULTS_HOLD_MS = 600

interface PathToVictoryStepProps {
  campaign: Campaign | null
  officeName?: string | null
  onLoadingChange?: (isLoading: boolean) => void
  onMetricsResolved?: (
    result:
      | {
          status: 'success'
          winNumber: number
          projectedTurnout: number
          totalRegisteredVoters: number | null
        }
      | { status: 'error'; reason: 'missing_turnout' | 'upstream_error' },
  ) => void
}

const formatOfficeName = (campaign: Campaign | null): string =>
  campaign?.positionName ||
  campaign?.organization?.customPositionName ||
  campaign?.office ||
  'your office'

export const PathToVictoryStep = ({
  campaign,
  officeName: officeNameProp,
  onLoadingChange,
  onMetricsResolved,
}: PathToVictoryStepProps): React.JSX.Element => {
  const [revealedCount, setRevealedCount] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [registeredVoters, setRegisteredVoters] = useState<number | null>(null)
  const metricsResolvedStatusRef = useRef<'success' | 'error' | null>(null)

  useEffect(() => {
    let cancelled = false
    clientRequest('GET /v1/contacts/stats', {})
      .then((res) => {
        if (cancelled) return
        setRegisteredVoters(res.data?.totalConstituents ?? null)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setRegisteredVoters(null)
        reportErrorToSentry(error as Error, {
          context: 'onboarding.pathToVictory.fetchContactsStats',
          campaignId: campaign?.id,
        })
      })
    return () => {
      cancelled = true
    }
  }, [campaign?.id])

  const officeName = officeNameProp || formatOfficeName(campaign)
  const metrics = campaign?.raceTargetMetrics ?? null
  const winNumber = metrics?.winNumber ?? 0
  const projectedTurnout = metrics?.projectedTurnout ?? 0

  useEffect(() => {
    if (revealedCount >= CHECKLIST_ITEMS.length) return
    const id = setTimeout(
      () => setRevealedCount((n) => n + 1),
      REVEAL_INTERVAL_MS,
    )
    return () => clearTimeout(id)
  }, [revealedCount])

  useEffect(() => {
    if (revealedCount < CHECKLIST_ITEMS.length) return
    const id = setTimeout(() => setShowResults(true), RESULTS_HOLD_MS)
    return () => clearTimeout(id)
  }, [revealedCount])

  useEffect(() => {
    onLoadingChange?.(!showResults)
  }, [showResults, onLoadingChange])

  useEffect(() => {
    if (!showResults) return
    if (metricsResolvedStatusRef.current === 'success') return
    if (!metrics || winNumber <= 0) {
      if (metricsResolvedStatusRef.current === 'error') return
      metricsResolvedStatusRef.current = 'error'
      onMetricsResolved?.({
        status: 'error',
        reason: !metrics ? 'upstream_error' : 'missing_turnout',
      })
      return
    }
    metricsResolvedStatusRef.current = 'success'
    onMetricsResolved?.({
      status: 'success',
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

  if (!showResults) {
    return (
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
            {CHECKLIST_ITEMS.map((template, index) => {
              const text = template.replace('{office}', officeName)
              const isChecked = index < revealedCount
              return (
                <li
                  key={template}
                  className={`flex items-center gap-3 rounded-lg border bg-white px-4 py-3 transition-opacity ${
                    isChecked
                      ? 'border-slate-200 opacity-100'
                      : 'border-slate-100 opacity-60'
                  }`}
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                      isChecked
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-300'
                    }`}
                  >
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-6 text-slate-700">
                    {text}
                  </span>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    )
  }

  if (!metrics || winNumber <= 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm leading-6 text-slate-700">
          We couldn&apos;t calculate vote projections for your district yet.
          We&apos;ll keep working on it in the background.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-left">
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

      <div>
        <p className="mb-3 text-sm font-medium text-slate-500">
          Here&apos;s how our projections work:
        </p>
        <ol className="space-y-3">
          {registeredVoters !== null && registeredVoters > 0 ? (
            <li className="flex items-start gap-4 rounded-xl border border-slate-200 p-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
                1
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-950">
                  Registered voters in your district
                </p>
                <p className="text-xs text-slate-500">
                  The total pool of voters eligible to cast a ballot in your
                  race.
                </p>
              </div>
              <span className="text-base font-bold text-slate-950">
                {numberFormatter(registeredVoters)}
              </span>
            </li>
          ) : null}
          <li className="flex items-start gap-4 rounded-xl border border-slate-200 p-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
              {registeredVoters !== null && registeredVoters > 0 ? 2 : 1}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-950">
                Average voter turnout
              </p>
              <p className="text-xs text-slate-500">
                Based on our projections from the last three election cycles.
              </p>
            </div>
            <span className="text-base font-bold text-slate-950">
              {numberFormatter(projectedTurnout)}
            </span>
          </li>
          <li className="flex items-start gap-4 rounded-xl border border-slate-200 p-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
              {registeredVoters !== null && registeredVoters > 0 ? 3 : 2}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-950">
                50% + 1 &mdash; Votes needed to win
              </p>
              <p className="text-xs text-slate-500">
                A simple majority of who actually votes.
              </p>
            </div>
            <span className="text-base font-bold text-slate-950">
              {numberFormatter(winNumber)}
            </span>
          </li>
        </ol>
      </div>
    </div>
  )
}
