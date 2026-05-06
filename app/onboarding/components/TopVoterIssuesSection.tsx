'use client'
import { useEffect } from 'react'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { Card, CardContent, Badge } from '@styleguide'
import {
  LuHeart,
  LuDollarSign,
  LuMapPin,
  LuBriefcase,
  LuGraduationCap,
  LuLeaf,
  LuShieldCheck,
  LuStethoscope,
  LuVote,
} from 'react-icons/lu'
import { clientRequest } from 'gpApi/typed-request'
import { reportErrorToSentry } from '@shared/sentry'

interface TopVoterIssuesSectionProps {
  city?: string
  state?: string
}

const VOTER_ISSUES_QUERY_KEY = 'onboarding-voter-issues'
const VOTER_ISSUES_ROUTE = 'GET /v1/onboarding/voter-issues'
const SENTRY_CONTEXT_FETCH_ISSUES = 'onboarding.voterIssues.fetch'
const SKELETON_PLACEHOLDER_COUNT = 3

const ISSUE_ICON_BASE =
  'flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600'

const PRIORITY_LABEL: Record<'high' | 'medium' | 'low', string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
}

const ICON_BY_KEYWORD: Array<{
  pattern: RegExp
  icon: React.JSX.Element
}> = [
  {
    pattern: /(safety|crime|police)/i,
    icon: <LuShieldCheck className="size-5" />,
  },
  {
    pattern: /(econom|job|business|tax)/i,
    icon: <LuDollarSign className="size-5" />,
  },
  { pattern: /(hous|rent|afford)/i, icon: <LuMapPin className="size-5" /> },
  {
    pattern: /(health|medic|hospital)/i,
    icon: <LuStethoscope className="size-5" />,
  },
  {
    pattern: /(educat|school|student)/i,
    icon: <LuGraduationCap className="size-5" />,
  },
  {
    pattern: /(environment|climate|energy)/i,
    icon: <LuLeaf className="size-5" />,
  },
  { pattern: /(work|employ|labor)/i, icon: <LuBriefcase className="size-5" /> },
  { pattern: /(elect|vot|democra)/i, icon: <LuVote className="size-5" /> },
]

const iconForLabel = (label: string): React.JSX.Element => {
  const match = ICON_BY_KEYWORD.find(({ pattern }) => pattern.test(label))
  return match ? match.icon : <LuHeart className="size-5" />
}

const voterIssuesQueryOptions = () =>
  queryOptions({
    queryKey: [VOTER_ISSUES_QUERY_KEY] as const,
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
  city,
  state,
}: TopVoterIssuesSectionProps): React.JSX.Element | null => {
  const query = useQuery(voterIssuesQueryOptions())

  useEffect(() => {
    if (!query.error) return
    reportErrorToSentry(query.error, {
      context: SENTRY_CONTEXT_FETCH_ISSUES,
    })
  }, [query.error])

  let jurisdiction = ''
  if (city && state) {
    jurisdiction = `${city}, ${state}`
  } else if (state) {
    jurisdiction = state
  }

  const issues = query.data?.issues ?? []

  if (!query.isPending && !query.error && issues.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-slate-950">
          Top issues for your voters
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          The issues voters{jurisdiction ? ' in ' : ' '}
          {jurisdiction ? (
            <span className="font-semibold text-slate-950">{jurisdiction}</span>
          ) : null}{' '}
          care about most right now.
        </p>
      </div>

      {query.isPending ? (
        <VoterIssuesSkeleton />
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <Card key={issue.label} className="rounded-2xl shadow-none">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={ISSUE_ICON_BASE}>
                      {iconForLabel(issue.label)}
                    </span>
                    <h3 className="text-base font-semibold text-slate-950">
                      {issue.label}
                    </h3>
                  </div>
                  <Badge className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white hover:bg-slate-950">
                    {PRIORITY_LABEL[issue.priority]}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${Math.round(issue.score)}%` }}
                    />
                  </div>
                  <p className="text-right text-xs text-slate-500">
                    {Math.round(issue.score)}% voters care
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
