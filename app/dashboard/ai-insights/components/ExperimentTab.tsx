'use client'
import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@styleguide'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { ExperimentRun, ExperimentId } from '../types'
import { VoterTargetingResults } from './VoterTargetingResults'
import { WalkingPlanResults } from './WalkingPlanResults'
import { DistrictIntelResults } from './DistrictIntelResults'
import { PeerCityBenchmarkingResults } from './PeerCityBenchmarkingResults'
import { MeetingBriefingResults } from './MeetingBriefingResults'

interface ExperimentTabProps {
  experimentId: ExperimentId
  description: string
  initialRun?: ExperimentRun
}

const POLL_INTERVAL_MS = 5000
const EXTENDED_WAIT_MS = 10 * 60 * 1000
const POLL_TIMEOUT_MS = 45 * 60 * 1000

const TIME_ESTIMATES: Record<ExperimentId, string> = {
  voter_targeting: '10-15 minutes',
  walking_plan: '10-15 minutes',
  district_intel: '15-30 minutes',
  peer_city_benchmarking: '15-30 minutes',
  meeting_briefing: '15-30 minutes',
}

export const ExperimentTab = ({
  experimentId,
  description,
  initialRun,
}: ExperimentTabProps) => {
  const [run, setRun] = useState<ExperimentRun | undefined>(initialRun)
  const [requesting, setRequesting] = useState(false)

  const isPending = run?.status === 'PENDING' || run?.status === 'RUNNING'
  const isSuccess = run?.status === 'SUCCESS'
  const isFailed =
    run?.status === 'FAILED' || run?.status === 'CONTRACT_VIOLATION'
  const isStale = run?.status === 'STALE'
  const hasNoRun = !run

  const pollStatus = useCallback(async () => {
    try {
      const response = await clientFetch<ExperimentRun[]>(
        apiRoutes.agentExperiments.mine,
      )
      if (!response.ok) return

      const runs = response.data || []
      const latestRun = runs
        .filter((r) => r.experimentId === experimentId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0]

      if (latestRun) {
        setRun(latestRun)
      }
    } catch {
      // Polling failure is transient; next interval tick will retry
    }
  }, [experimentId])

  useEffect(() => {
    pollStatus()
  }, [])

  useEffect(() => {
    if (!isPending) return

    const interval = setInterval(pollStatus, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [isPending, pollStatus])

  const [isExtendedWait, setIsExtendedWait] = useState(false)
  const [isTimedOut, setIsTimedOut] = useState(false)

  useEffect(() => {
    if (!isPending) {
      setIsExtendedWait(false)
      setIsTimedOut(false)
      return
    }

    const extendedTimer = setTimeout(
      () => setIsExtendedWait(true),
      EXTENDED_WAIT_MS,
    )
    const timeoutTimer = setTimeout(() => setIsTimedOut(true), POLL_TIMEOUT_MS)

    return () => {
      clearTimeout(extendedTimer)
      clearTimeout(timeoutTimer)
    }
  }, [isPending, run?.runId])

  const [requestError, setRequestError] = useState<string | null>(null)

  const handleRequest = async () => {
    setRequesting(true)
    setRequestError(null)
    setIsExtendedWait(false)
    setIsTimedOut(false)
    try {
      const response = await clientFetch<{ runId: string; status: string }>(
        apiRoutes.agentExperiments.request,
        { experimentId },
      )
      if (response.ok && response.data) {
        setRun({
          id: response.data.runId,
          runId: response.data.runId,
          experimentId,
          candidateId: '',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      } else {
        const apiMessage =
          response.data &&
          typeof response.data === 'object' &&
          'message' in response.data &&
          typeof (response.data as Record<string, unknown>).message === 'string'
            ? ((response.data as Record<string, unknown>).message as string)
            : null
        setRequestError(
          apiMessage || 'Failed to request report. Please try again.',
        )
      }
    } catch {
      setRequestError('Network error. Please check your connection and try again.')
    } finally {
      setRequesting(false)
    }
  }

  const formatDuration = (seconds?: number | null) => {
    if (seconds == null) return ''
    if (seconds < 60) return `${Math.round(seconds)}s`
    return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      {requestError && (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-800 mb-6">
          <AlertCircle className="size-5 shrink-0" />
          <span>{requestError}</span>
        </div>
      )}

      {isPending && !isTimedOut && (
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 mb-6">
          <Loader2 className="size-5 animate-spin shrink-0" />
          <span>
            {isExtendedWait
              ? 'Still working — this is taking longer than expected. We\u2019ll keep checking.'
              : `Generating your report... This usually takes ${TIME_ESTIMATES[experimentId]}.`}
          </span>
        </div>
      )}

      {isPending && isTimedOut && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="size-5 shrink-0" />
            <span>
              Report generation timed out. Please try again.
            </span>
          </div>
          <Button
            variant="default"
            size="medium"
            onClick={handleRequest}
            loading={requesting}
            loadingText="Requesting..."
            disabled={requesting}
          >
            Try Again
          </Button>
        </div>
      )}

      {isFailed && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="size-5 shrink-0" />
            <span>
              {run?.error ||
                'Something went wrong generating your report.'}
            </span>
          </div>
          <Button
            variant="default"
            size="medium"
            onClick={handleRequest}
            loading={requesting}
            loadingText="Requesting..."
            disabled={requesting}
          >
            Try Again
          </Button>
        </div>
      )}

      {isStale && (
        <div className="rounded-lg border border-dashed p-8 text-center mb-6">
          <p className="text-sm text-amber-700 mb-2">
            A dependency was updated. Regenerate to get fresh results.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Click below to generate an updated report.
          </p>
          <Button
            variant="default"
            size="medium"
            onClick={handleRequest}
            loading={requesting}
            loadingText="Requesting..."
            disabled={requesting}
          >
            Regenerate Report
          </Button>
        </div>
      )}

      {hasNoRun && (
        <div className="rounded-lg border border-dashed p-8 text-center mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            No report generated yet. Click below to analyze your district.
          </p>
          <Button
            variant="default"
            size="medium"
            onClick={handleRequest}
            loading={requesting}
            loadingText="Requesting..."
            disabled={requesting}
          >
            Generate Report
          </Button>
        </div>
      )}

      {isSuccess && run && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Generated {new Date(run.updatedAt).toLocaleDateString()}{' '}
              {run.durationSeconds
                ? `in ${formatDuration(run.durationSeconds)}`
                : ''}
            </span>
            <Button
              variant="outline"
              size="small"
              onClick={handleRequest}
              loading={requesting}
              loadingText="Regenerating..."
              disabled={requesting}
            >
              Regenerate
            </Button>
          </div>

          {experimentId === 'voter_targeting' && (
            <VoterTargetingResults runId={run.runId} />
          )}
          {experimentId === 'walking_plan' && (
            <WalkingPlanResults runId={run.runId} />
          )}
          {experimentId === 'district_intel' && (
            <DistrictIntelResults runId={run.runId} />
          )}
          {experimentId === 'peer_city_benchmarking' && (
            <PeerCityBenchmarkingResults runId={run.runId} />
          )}
          {experimentId === 'meeting_briefing' && (
            <MeetingBriefingResults runId={run.runId} />
          )}
        </div>
      )}
    </div>
  )
}
