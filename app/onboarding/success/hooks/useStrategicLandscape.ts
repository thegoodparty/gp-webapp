'use client'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { clientRequest } from 'gpApi/typed-request'
import type {
  StrategicLandscapeData,
  StrategicLandscapeResponse,
} from 'gpApi/api-endpoints'

const STRATEGIC_LANDSCAPE_ROUTE =
  'POST /v1/campaignStrategy/mine/strategic-landscape' as const

const STRATEGIC_LANDSCAPE_QUERY_KEY = ['strategic-landscape', 'mine'] as const

// Background generation runs three Gemini pipelines in parallel and takes
// ~30-90s on first call. Poll quickly enough that the UI feels responsive
// without hammering the API.
const POLL_INTERVAL_MS = 3000

const strategicLandscapeQueryOptions = () =>
  queryOptions({
    queryKey: STRATEGIC_LANDSCAPE_QUERY_KEY,
    queryFn: () =>
      clientRequest(STRATEGIC_LANDSCAPE_ROUTE, {}).then((res) => res.data),
    // Stop polling as soon as the server returns `ready` (or errors out).
    refetchInterval: (query) =>
      query.state.data?.status === 'generating' ? POLL_INTERVAL_MS : false,
    // Once we've got ready data, don't re-poll on remount.
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    // 400 means the campaign has no race yet, 502 means election-api is down —
    // neither benefits from aggressive retry.
    retry: 1,
  })

export type StrategicLandscapeQueryResult = {
  data: StrategicLandscapeData | undefined
  isGenerating: boolean
  isPending: boolean
  isError: boolean
}

export function useStrategicLandscape(): StrategicLandscapeQueryResult {
  const query = useQuery(strategicLandscapeQueryOptions())
  const response: StrategicLandscapeResponse | undefined = query.data
  return {
    data: response?.status === 'ready' ? response.data : undefined,
    isGenerating: response?.status === 'generating',
    isPending: query.isPending,
    isError: query.isError,
  }
}

// Pre-warm hook: fire-and-forget POST that kicks off the background
// generation without waiting for the result. Called after the user
// submits their office in onboarding so the section is usually ready by
// the time they reach the success page. Same idempotency guarantees as
// the polling hook — gp-api dedupes via its per-pod inFlight slot, so
// pre-warm + success-page mount collapse to a single LLM run.
export async function prewarmStrategicLandscape(): Promise<void> {
  try {
    await clientRequest(STRATEGIC_LANDSCAPE_ROUTE, {})
  } catch {
    // Swallow — pre-warm is best-effort. The success page will re-call
    // the endpoint and surface real errors via the polling hook.
  }
}
