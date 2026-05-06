'use client'
import { useMemo, useState } from 'react'
import { useQuery, queryOptions } from '@tanstack/react-query'
import { Card, CardContent, Badge } from '@styleguide'
import { LuNewspaper, LuTv, LuRadioTower } from 'react-icons/lu'
import { clientRequest } from 'gpApi/typed-request'

type OutletType = 'TV' | 'print' | 'radio'

interface Outlet {
  name: string
  type: OutletType
  description: string
}

const localNewsQueryOptions = (params: {
  city?: string
  state?: string
  office?: string
}) =>
  queryOptions({
    queryKey: ['onboarding-local-news', params] as const,
    enabled: Boolean(params.state && params.office),
    queryFn: () =>
      clientRequest('GET /v1/onboarding/local-news', {
        city: params.city,
        state: params.state ?? '',
        office: params.office ?? '',
      }).then((res) => res.data),
  })

export { localNewsQueryOptions }

const typeIcon: Record<OutletType, React.JSX.Element> = {
  print: (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      <LuNewspaper className="size-5" />
    </span>
  ),
  TV: (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
      <LuTv className="size-5" />
    </span>
  ),
  radio: (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
      <LuRadioTower className="size-5" />
    </span>
  ),
}

const typeLabel: Record<OutletType, string> = {
  TV: 'Television',
  print: 'Print',
  radio: 'Radio',
}

interface LocalNewsSourcesSectionProps {
  city?: string
  state?: string
  office?: string
  jurisdictionLabel?: string
}

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

  const outlets: Outlet[] = useMemo(
    () => query.data?.outlets ?? [],
    [query.data?.outlets],
  )

  const groupedOutlets = useMemo(() => {
    const groups: Array<{ type: OutletType; outlets: Outlet[] }> = []
    const indexByType = new Map<OutletType, number>()
    for (const outlet of outlets) {
      const existingIndex = indexByType.get(outlet.type)
      const existingGroup =
        existingIndex !== undefined ? groups[existingIndex] : undefined
      if (existingGroup) {
        existingGroup.outlets.push(outlet)
      } else {
        indexByType.set(outlet.type, groups.length)
        groups.push({ type: outlet.type, outlets: [outlet] })
      }
    }
    return groups
  }, [outlets])

  if (!state || !office) return null

  const toggleType = (type: OutletType) =>
    setExpandedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })

  return (
    <section className="flex w-full flex-col gap-4 text-left">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-950">
          Local News Sources
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          These are the local news sources we&apos;re monitoring in{' '}
          <span className="font-semibold text-slate-950">
            {jurisdictionLabel ?? (city ? `${city}, ${state}` : state)}
          </span>{' '}
          for campaign insights. You will be able to add / change and customize
          these later in your campaign plan.
        </p>
      </div>

      {query.isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      ) : query.error ? (
        <p className="text-sm text-slate-500">
          We couldn&apos;t load local news sources right now.
        </p>
      ) : outlets.length === 0 ? (
        <p className="text-sm text-slate-500">
          No local news sources found for this area yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {groupedOutlets.map(({ type, outlets: typeOutlets }) => {
            const isExpanded = expandedTypes.has(type)
            const visible = isExpanded ? typeOutlets : typeOutlets.slice(0, 1)
            const additionalCount = typeOutlets.length - 1
            return (
              <Card
                key={type}
                className="rounded-xl border-slate-200 shadow-none"
              >
                <CardContent className="flex flex-col gap-4 px-4 py-3">
                  {visible.map((outlet, index) => (
                    <div
                      key={`${outlet.name}-${outlet.type}`}
                      className={
                        index === 0
                          ? 'flex items-start gap-4'
                          : 'flex items-start gap-4 border-t border-slate-100 pt-4'
                      }
                    >
                      {typeIcon[outlet.type]}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-slate-950">
                          {outlet.name}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {outlet.description}
                        </p>
                      </div>
                      <Badge
                        variant="default"
                        className="rounded-full bg-slate-950 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-950"
                      >
                        {typeLabel[outlet.type]}
                      </Badge>
                    </div>
                  ))}
                  {additionalCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => toggleType(type)}
                      className="-mb-2 self-center text-sm font-semibold text-primary hover:underline"
                    >
                      {isExpanded
                        ? `Show fewer ${typeLabel[type].toLowerCase()} sources`
                        : `View ${additionalCount} more ${typeLabel[
                            type
                          ].toLowerCase()} ${
                            additionalCount === 1 ? 'source' : 'sources'
                          }`}
                    </button>
                  ) : null}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
