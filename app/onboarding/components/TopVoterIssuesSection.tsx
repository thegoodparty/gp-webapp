'use client'
import { useEffect, useState } from 'react'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@styleguide'
import { clientRequest } from 'gpApi/typed-request'
import { reportErrorToSentry } from '@shared/sentry'

interface TopVoterIssuesSectionProps {
  ballotReadyPositionId?: string
  city?: string
  state?: string
  office?: string
  headingsAsSubsections?: boolean
}

const VOTER_ISSUES_QUERY_KEY = 'onboarding-voter-issues'
const VOTER_ISSUES_ROUTE = 'GET /v1/onboarding/voter-issues'
const SENTRY_CONTEXT_FETCH_ISSUES = 'onboarding.voterIssues.fetch'
const SKELETON_PLACEHOLDER_COUNT = 3
const COLLAPSED_ISSUES_VISIBLE = 3

// Endpoint derives district from the org cookie, so the request takes no
// params. We still key the cache by office identity so navigating back and
// changing zip/office refetches instead of returning the prior district.
const voterIssuesQueryOptions = (params: {
  ballotReadyPositionId?: string
  city?: string
  state?: string
  office?: string
}) =>
  queryOptions({
    queryKey: [VOTER_ISSUES_QUERY_KEY, params] as const,
    queryFn: () =>
      clientRequest(VOTER_ISSUES_ROUTE, {}).then((res) => res.data),
  })

export { voterIssuesQueryOptions }

const VoterIssuesSkeleton = (): React.JSX.Element => (
  <div className="space-y-3">
    {Array.from({ length: SKELETON_PLACEHOLDER_COUNT }).map((_, index) => (
      <div
        key={index}
        className="h-28 animate-pulse rounded-2xl bg-slate-100"
      />
    ))}
  </div>
)

export const TopVoterIssuesSection = ({
  ballotReadyPositionId,
  city,
  state,
  office,
  headingsAsSubsections = false,
}: TopVoterIssuesSectionProps): React.JSX.Element | null => {
  const query = useQuery(
    voterIssuesQueryOptions({ ballotReadyPositionId, city, state, office }),
  )
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!query.error) return
    reportErrorToSentry(query.error, {
      context: SENTRY_CONTEXT_FETCH_ISSUES,
    })
  }, [query.error])

  let audienceLabel = ''
  if (office) {
    audienceLabel = office
  } else if (city && state) {
    audienceLabel = `${city}, ${state}`
  } else if (state) {
    audienceLabel = state
  }

  const issues = query.data?.issues ?? []

  if (!query.isPending && issues.length === 0) {
    return null
  }

  const visibleIssues = isExpanded
    ? issues
    : issues.slice(0, COLLAPSED_ISSUES_VISIBLE)
  const additionalCount = issues.length - COLLAPSED_ISSUES_VISIBLE

  const HeadingTag = headingsAsSubsections ? 'h3' : 'h2'
  const headingClass = headingsAsSubsections
    ? 'text-lg font-semibold text-foreground'
    : 'text-2xl font-semibold text-slate-950'

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-1">
        <HeadingTag className={headingClass}>
          Top issues for your voters
        </HeadingTag>
        <p className="text-sm leading-6 text-slate-500">
          {audienceLabel ? (
            <>
              The issues voters in your race for{' '}
              <span className="font-semibold text-slate-950">
                {audienceLabel}
              </span>{' '}
              care about most right now.
            </>
          ) : (
            <>The issues your voters care about most right now.</>
          )}
        </p>
      </div>

      {query.isPending ? (
        <VoterIssuesSkeleton />
      ) : (
        <Card className="rounded-2xl shadow-none">
          <CardContent className="flex flex-col gap-3 px-4 py-3">
            {visibleIssues.map((issue, index) => (
              <div key={issue.label} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {issue.label}
                </h3>
              </div>
            ))}
            {additionalCount > 0 ? (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="-mb-1 self-center text-sm font-semibold text-primary hover:underline"
              >
                {isExpanded
                  ? 'Show fewer issues'
                  : `View ${additionalCount} more ${
                      additionalCount === 1 ? 'issue' : 'issues'
                    }`}
              </button>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
