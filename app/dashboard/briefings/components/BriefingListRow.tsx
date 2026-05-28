import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { formatDayTime, formatShortDate } from '@shared/briefings/dateHelpers'
import type { BriefingSummary, BriefingStatus } from '@shared/briefings/types'

type Props = {
  summary: BriefingSummary
}

type PillVariant = {
  label: string
  className: string
}

function pillFor(status: BriefingStatus): PillVariant | null {
  if (status === 'briefing_ready') {
    return {
      label: 'Briefing ready',
      className: 'bg-success-100 text-success-700',
    }
  }
  if (status === 'awaiting_agenda') {
    return {
      label: 'Awaiting agenda',
      className: 'bg-muted text-muted-foreground',
    }
  }
  return null
}

/**
 * One row in the Upcoming list. Open-circle indicator dot, short date,
 * full date + time, meeting name, status pill, chevron.
 *
 * Clicking the row navigates to the briefing detail page. Rows for
 * Awaiting agenda briefings link to the same route; the detail page
 * decides what to render (briefing content vs an awaiting state).
 */
export default function BriefingListRow({ summary }: Props): React.JSX.Element {
  const pill = pillFor(summary.status)
  const shortDate = formatShortDate(summary.scheduledAt)
  const dayTime = formatDayTime(summary.scheduledAt)

  return (
    <Link
      href={`/dashboard/briefings/${summary.slug}`}
      className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus:bg-muted/60 focus:outline-none"
    >
      {/* Indicator dot - open circle for upcoming */}
      <span
        aria-hidden
        className="inline-block size-2.5 shrink-0 rounded-full border-2 border-current text-muted-foreground/60"
      />

      {/* Date column: short on mobile, full on md+ */}
      <span className="shrink-0 text-xs font-medium text-muted-foreground">
        <span className="inline-block w-16 md:hidden">{shortDate}</span>
        <span className="hidden w-52 md:inline-block">
          {shortDate} · {dayTime}
        </span>
      </span>

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
        {summary.meetingName}
      </span>

      {pill ? (
        <span
          className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${pill.className}`}
        >
          {pill.label}
        </span>
      ) : null}

      <ChevronRight
        aria-hidden
        className="size-4 shrink-0 text-muted-foreground"
      />
    </Link>
  )
}
