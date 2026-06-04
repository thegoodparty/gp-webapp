'use client'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { clientRequest } from 'gpApi/typed-request'
import type {
  CommunityEventsData,
  CommunityEventsResponse,
} from 'gpApi/api-endpoints'

const COMMUNITY_EVENTS_ROUTE =
  'POST /v1/campaignStrategy/mine/community-events' as const

const COMMUNITY_EVENTS_QUERY_KEY = ['community-events', 'mine'] as const

// Background generation runs Gemini search + structured in series. Roughly
// 15-30s end-to-end on first call. Cache hits return immediately.
const POLL_INTERVAL_MS = 3000

const communityEventsQueryOptions = () =>
  queryOptions({
    queryKey: COMMUNITY_EVENTS_QUERY_KEY,
    queryFn: () =>
      clientRequest(COMMUNITY_EVENTS_ROUTE, {}).then((res) => res.data),
    refetchInterval: (query) =>
      query.state.data?.status === 'generating' ? POLL_INTERVAL_MS : false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    // 400 (missing raceId/electionDate) and 502 (Gemini down) don't benefit
    // from aggressive retry — surface to the UI's empty/error state.
    retry: 1,
  })

export type CommunityEventsQueryResult = {
  data: CommunityEventsData | undefined
  isGenerating: boolean
  isPending: boolean
  isError: boolean
}

export function useCommunityEvents(): CommunityEventsQueryResult {
  const query = useQuery(communityEventsQueryOptions())
  const response: CommunityEventsResponse | undefined = query.data
  return {
    data: response?.status === 'ready' ? response.data : undefined,
    isGenerating: response?.status === 'generating',
    isPending: query.isPending,
    isError: query.isError,
  }
}

// Pre-warm hook: fire-and-forget POST that kicks off the background
// generation without waiting for the result. Called after the user
// submits their office in onboarding so the events are usually ready by
// the time they reach the success page. The endpoint is idempotent
// (server-side inFlight slot + JSON-column cache), so multiple calls are
// safe — only the first one triggers an LLM run.
export async function prewarmCommunityEvents(): Promise<void> {
  try {
    await clientRequest(COMMUNITY_EVENTS_ROUTE, {})
  } catch {
    // Swallow — pre-warm is best-effort. The success page will re-call
    // the endpoint and surface real errors via the polling hook.
  }
}
