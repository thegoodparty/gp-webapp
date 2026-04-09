'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LuThumbsUp, LuThumbsDown, LuMoveRight } from 'react-icons/lu'
import { PriorityIssue } from '../../shared/briefing-types'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

// Issue color palette — 3 colors cycling through brand families.
// Uses /900 for badge/text/border (dark), /50 for callout bg (tint).
// Tip callout is always bright-yellow regardless of issue color.
const ISSUE_COLORS = [
  {
    // midnight blue (issue 1, 4, 7, ...)
    badge: 'bg-brand-midnight-900',
    text: 'text-brand-midnight-900',
    border: 'border-l-brand-midnight-900',
    bg: 'bg-brand-midnight-50',
  },
  {
    // halo green (issue 2, 5, 8, ...)
    badge: 'bg-brand-halo-green-900',
    text: 'text-brand-halo-green-900',
    border: 'border-l-brand-halo-green-900',
    bg: 'bg-brand-halo-green-50',
  },
  {
    // waxflower / terracotta (issue 3, 6, 9, ...)
    badge: 'bg-brand-waxflower-900',
    text: 'text-brand-waxflower-900',
    border: 'border-l-brand-waxflower-900',
    bg: 'bg-brand-waxflower-50',
  },
] as const

interface PriorityIssueCardProps {
  issue: PriorityIssue
  totalCount: number
  date: string
  weekday: string
  colorIndex: number
}

export default function PriorityIssueCard({
  issue,
  totalCount,
  date,
  weekday,
  colorIndex,
}: PriorityIssueCardProps) {
  const router = useRouter()
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null)
  // TODO: rename card → guidance, detail → analysis after pipeline field rename
  const { card: guidance } = issue
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const color = ISSUE_COLORS[colorIndex % ISSUE_COLORS.length]!

  return (
    <div className="px-6 py-4">
      {/* Priority Issue label row */}
      <div className="flex items-center gap-1 mb-2">
        <div
          className={`flex items-center justify-center rounded-sm text-[10px] font-bold text-white ${color.badge}`}
          style={{ width: 16, height: 16 }}
        >
          {issue.number}
        </div>
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${color.text}`}
        >
          Priority Issue {issue.number} of {totalCount}
        </span>
      </div>

      {/* Headline */}
      <h3 className="text-lg font-semibold text-card-foreground leading-7 mb-3">
        {guidance.headline}
      </h3>

      {/* Body content — gap-3 between all sections */}
      <div className="flex flex-col gap-3">
        {/* Agenda Item */}
        <div className="flex flex-col gap-1">
          <p
            className={`text-xs font-semibold uppercase tracking-wide ${color.text}`}
          >
            Agenda Item
          </p>
          <p className="text-sm text-card-foreground leading-normal">
            {issue.agendaItemTitle}
          </p>
        </div>

        {/* Before [weekday] */}
        <div className="flex flex-col gap-1">
          <p
            className={`text-xs font-semibold uppercase tracking-wide ${color.text}`}
          >
            Before {weekday}
          </p>
          <p className="text-sm text-card-foreground leading-relaxed">
            {guidance.whatYouNeedToDo}
          </p>
        </div>

        {/* SAY THIS IN THE ROOM */}
        <div className={`px-6 py-4 border-l-4 ${color.border} ${color.bg}`}>
          <p
            className={`text-xs font-semibold uppercase tracking-wide mb-2 ${color.text}`}
          >
            Say this in the room
          </p>
          <p className="text-sm italic text-card-foreground leading-relaxed">
            &ldquo;{guidance.askThisInTheRoom}&rdquo;
          </p>
        </div>

        {/* TIP — always bright-yellow, not issue-colored */}
        {guidance.tryThis && (
          <div className="px-6 py-4 border-l-4 border-l-brand-bright-yellow-900 bg-brand-bright-yellow-50">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-brand-bright-yellow-900">
              Tip
            </p>
            <p className="text-xs font-semibold mb-2 text-brand-bright-yellow-900">
              If you&apos;re pressed for a position, try this:
            </p>
            <p className="text-sm italic text-card-foreground leading-relaxed">
              {guidance.tryThis}
            </p>
          </div>
        )}
      </div>

      {/* Feedback + Read the full briefing */}
      <div className="flex items-center gap-3 py-1 mt-3">
        <span className="text-sm text-muted-foreground">Was this helpful?</span>
        <button
          onClick={() => {
            setFeedback('yes')
            trackEvent(EVENTS.Briefings.FeedbackHelpful, {
              date,
              issueNumber: issue.number,
              issueSlug: issue.slug,
            })
          }}
          className={`inline-flex items-center gap-1 text-sm transition-colors ${
            feedback === 'yes'
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LuThumbsUp className="h-3.5 w-3.5" />
          Yes
        </button>
        <button
          onClick={() => {
            setFeedback('no')
            trackEvent(EVENTS.Briefings.FeedbackNotHelpful, {
              date,
              issueNumber: issue.number,
              issueSlug: issue.slug,
            })
          }}
          className={`inline-flex items-center gap-1 text-sm transition-colors ${
            feedback === 'no'
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LuThumbsDown className="h-3.5 w-3.5" />
          No
        </button>
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => {
            trackEvent(EVENTS.Briefings.ClickReadFullBriefing, {
              date,
              issueNumber: issue.number,
              issueSlug: issue.slug,
            })
            router.push(`/dashboard/briefings/${date}/${issue.number}`)
          }}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-full px-6 h-10 text-sm font-medium transition-colors"
        >
          Read the full briefing
          <LuMoveRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
