'use client'
import { useEffect, useMemo, useState } from 'react'
import { useQuery, queryOptions } from '@tanstack/react-query'
import { Card, CardContent, Badge } from '@styleguide'
import { clientRequest } from 'gpApi/typed-request'
import { reportErrorToSentry } from '@shared/sentry'

const OUTLET_TYPE = {
  TV: 'TV',
  PRINT: 'print',
  RADIO: 'radio',
} as const
type OutletType = (typeof OUTLET_TYPE)[keyof typeof OUTLET_TYPE]

const LOCAL_NEWS_QUERY_KEY = 'onboarding-local-news'
const LOCAL_NEWS_ROUTE = 'GET /v1/onboarding/local-news'
const SENTRY_CONTEXT_FETCH_OUTLETS = 'onboarding.localNews.fetchOutlets'
const COLLAPSED_OUTLETS_VISIBLE = 1
const SKELETON_PLACEHOLDER_COUNT = 3
// gp-api runs the AI call as a background promise and persists the result on
// the campaign record. The endpoint returns either { status: 'pending' } or
// { status: 'ready', outlets }. Poll while pending so we never hold an open
// request across the Next.js proxy's 30s ceiling.
const LOCAL_NEWS_POLL_INTERVAL_MS = 3_000

interface Outlet {
  name: string
  type: OutletType
  description: string
  email?: string | null
  phone?: string | null
  address?: string | null
}

interface OutletGroup {
  type: OutletType
  outlets: Outlet[]
}

const localNewsQueryOptions = (params: {
  city?: string
  state?: string
  office?: string
}) =>
  queryOptions({
    queryKey: [LOCAL_NEWS_QUERY_KEY, params] as const,
    enabled: Boolean(params.state && params.office),
    queryFn: () =>
      clientRequest(LOCAL_NEWS_ROUTE, {
        city: params.city,
        state: params.state ?? '',
        office: params.office ?? '',
      }).then((res) => res.data),
    refetchInterval: (query) =>
      query.state.data?.status === 'pending'
        ? LOCAL_NEWS_POLL_INTERVAL_MS
        : false,
    // Once we've got ready data, don't re-poll on remount or Strict-Mode
    // effect double-runs.
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  })

export { localNewsQueryOptions }

const typeLabel: Record<OutletType, string> = {
  [OUTLET_TYPE.TV]: 'Television',
  [OUTLET_TYPE.PRINT]: 'Print',
  [OUTLET_TYPE.RADIO]: 'Radio',
}

const groupOutletsByType = (outlets: Outlet[]): OutletGroup[] => {
  const groups: OutletGroup[] = []
  const indexByType = new Map<OutletType, number>()
  for (const outlet of outlets) {
    const existingIndex = indexByType.get(outlet.type)
    const existingGroup =
      existingIndex !== undefined ? groups[existingIndex] : undefined
    if (existingGroup) {
      existingGroup.outlets.push(outlet)
      continue
    }
    indexByType.set(outlet.type, groups.length)
    groups.push({ type: outlet.type, outlets: [outlet] })
  }
  return groups
}

interface LocalNewsHeaderProps {
  jurisdiction: string
}

const LocalNewsHeader = ({
  jurisdiction,
}: LocalNewsHeaderProps): React.JSX.Element => (
  <div className="space-y-2">
    <h2 className="text-2xl font-semibold text-foreground">
      Local News Sources
    </h2>
    <p className="text-sm leading-6 text-muted-foreground">
      These are the local news sources we&apos;re monitoring for{' '}
      <span className="font-semibold text-foreground">{jurisdiction}</span> for
      campaign insights. You will be able to add / change and customize these
      later in your campaign plan.
    </p>
  </div>
)

const LocalNewsSkeleton = (): React.JSX.Element => (
  <div className="space-y-3">
    {Array.from({ length: SKELETON_PLACEHOLDER_COUNT }).map((_, index) => (
      <div key={index} className="h-20 animate-pulse rounded-lg bg-muted" />
    ))}
  </div>
)

interface OutletRowProps {
  outlet: Outlet
  withDivider: boolean
}

const OutletRow = ({
  outlet,
  withDivider,
}: OutletRowProps): React.JSX.Element => (
  <div
    className={
      withDivider
        ? 'flex items-start gap-4 border-t border-base-border pt-4'
        : 'flex items-start gap-4'
    }
  >
    <div className="min-w-0 flex-1">
      <h3 className="text-base font-semibold text-foreground">{outlet.name}</h3>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {outlet.description}
      </p>
    </div>
    <Badge variant="soft">{typeLabel[outlet.type]}</Badge>
  </div>
)

interface ToggleGroupExpansionButtonProps {
  type: OutletType
  additionalCount: number
  isExpanded: boolean
  onToggle: () => void
}

const ToggleGroupExpansionButton = ({
  type,
  additionalCount,
  isExpanded,
  onToggle,
}: ToggleGroupExpansionButtonProps): React.JSX.Element => {
  const lowercaseLabel = typeLabel[type].toLowerCase()
  const sourceWord = additionalCount === 1 ? 'source' : 'sources'
  const buttonLabel = isExpanded
    ? `Show fewer ${lowercaseLabel} sources`
    : `View ${additionalCount} more ${lowercaseLabel} ${sourceWord}`

  return (
    <button
      type="button"
      onClick={onToggle}
      className="-mb-2 self-center text-sm font-semibold text-primary hover:underline"
    >
      {buttonLabel}
    </button>
  )
}

interface OutletGroupCardProps {
  group: OutletGroup
  isExpanded: boolean
  onToggle: () => void
}

const OutletGroupCard = ({
  group,
  isExpanded,
  onToggle,
}: OutletGroupCardProps): React.JSX.Element => {
  const visibleOutlets = isExpanded
    ? group.outlets
    : group.outlets.slice(0, COLLAPSED_OUTLETS_VISIBLE)
  const additionalCount = group.outlets.length - COLLAPSED_OUTLETS_VISIBLE

  return (
    <Card className="rounded-xl border-base-border shadow-none">
      <CardContent className="flex flex-col gap-4 px-4 py-3">
        {visibleOutlets.map((outlet, index) => (
          <OutletRow
            key={`${outlet.name}-${outlet.type}`}
            outlet={outlet}
            withDivider={index > 0}
          />
        ))}
        {additionalCount > 0 ? (
          <ToggleGroupExpansionButton
            type={group.type}
            additionalCount={additionalCount}
            isExpanded={isExpanded}
            onToggle={onToggle}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}

interface LocalNewsSourcesSectionProps {
  city?: string
  state?: string
  office?: string
  jurisdictionLabel?: string
}

const resolveJurisdiction = ({
  office,
  jurisdictionLabel,
  city,
  state,
}: LocalNewsSourcesSectionProps): string =>
  office ?? jurisdictionLabel ?? (city ? `${city}, ${state}` : (state ?? ''))

export const LocalNewsSourcesSection = ({
  city,
  state,
  office,
  jurisdictionLabel,
}: LocalNewsSourcesSectionProps): React.JSX.Element | null => {
  const query = useQuery(localNewsQueryOptions({ city, state, office }))
  const [expandedTypes, setExpandedTypes] = useState<Set<OutletType>>(
    () => new Set(),
  )

  useEffect(() => {
    if (!query.error) return
    reportErrorToSentry(query.error, {
      context: SENTRY_CONTEXT_FETCH_OUTLETS,
      state,
      office,
    })
  }, [query.error, state, office])

  const outlets: Outlet[] = useMemo(
    () => (query.data?.status === 'ready' ? query.data.outlets : []),
    [query.data],
  )

  const groupedOutlets = useMemo(() => groupOutletsByType(outlets), [outlets])

  if (!state || !office) return null

  const handleToggleType = (type: OutletType) =>
    setExpandedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })

  const jurisdiction = resolveJurisdiction({
    office,
    jurisdictionLabel,
    city,
    state,
  })

  const renderBody = () => {
    if (query.isPending || query.data?.status === 'pending')
      return <LocalNewsSkeleton />
    if (query.error) {
      return (
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load local news sources right now.
        </p>
      )
    }
    if (outlets.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">
          No local news sources found for this area yet.
        </p>
      )
    }
    return (
      <div className="flex flex-col gap-6">
        {groupedOutlets.map((group) => (
          <OutletGroupCard
            key={group.type}
            group={group}
            isExpanded={expandedTypes.has(group.type)}
            onToggle={() => handleToggleType(group.type)}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="flex w-full flex-col gap-4 text-left">
      <LocalNewsHeader jurisdiction={jurisdiction} />
      {renderBody()}
    </section>
  )
}
