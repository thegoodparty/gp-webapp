'use client'
import { useQuery, queryOptions } from '@tanstack/react-query'
import { Card, CardContent, Badge } from '@styleguide'
import { LuNewspaper, LuTv, LuRadio } from 'react-icons/lu'
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
    <span className="flex size-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
      <LuNewspaper className="size-4" />
    </span>
  ),
  TV: (
    <span className="flex size-8 items-center justify-center rounded-md bg-red-50 text-red-600">
      <LuTv className="size-4" />
    </span>
  ),
  radio: (
    <span className="flex size-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
      <LuRadio className="size-4" />
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

  if (!state || !office) return null

  const outlets: Outlet[] = query.data?.outlets ?? []

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
        <div className="flex flex-col gap-3">
          {outlets.map((outlet) => (
            <Card
              key={`${outlet.name}-${outlet.type}`}
              className="rounded-xl border-slate-200 shadow-none"
            >
              <CardContent className="flex items-start gap-4 p-4">
                {typeIcon[outlet.type]}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-slate-950">
                    {outlet.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {outlet.description}
                  </p>
                </div>
                <Badge variant="default">{typeLabel[outlet.type]}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
