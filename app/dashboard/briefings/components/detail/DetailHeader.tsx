import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ArrowLeftIcon } from '@styleguide'
import { briefingsLandingHref } from '@shared/briefings/routes'
import type { Briefing } from '@shared/briefings/types'
import DetailHeaderActions from './DetailHeaderActions'

type Props = {
  briefing: Briefing
  preparedForLine?: string
  meetingMetaLine?: string
  liveBriefingUrl?: string
}

function formatMeetingDate(meetingDate: string): string {
  try {
    return format(parseISO(meetingDate), 'EEE MMM d, yyyy')
  } catch {
    return meetingDate
  }
}

/**
 * Sticky top bar on the briefing detail page. Layout matches Lovable:
 *  - Small back-arrow link (icon-only) on the far left.
 *  - Three-line title block: meeting body name, formatted meeting date,
 *    location. Meeting time is intentionally omitted until the
 *    MeetingBriefingFull contract exposes it.
 *  - Desktop-only Download button on the right.
 */
export default function DetailHeader({
  briefing,
  preparedForLine,
  meetingMetaLine,
  liveBriefingUrl,
}: Props): React.JSX.Element {
  const formattedDate = formatMeetingDate(briefing.meeting_date)
  return (
    <div className="sticky top-0 z-20 border-b border-border bg-sidebar">
      <div className="flex w-full items-start gap-3 px-4 py-4 lg:px-8">
        <Link
          href={briefingsLandingHref()}
          aria-label="Back to meetings"
          className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeftIcon className="size-5" aria-hidden />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <h1 className="text-lg font-semibold leading-tight text-foreground lg:text-xl">
            {briefing.meeting_name}
          </h1>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
          {briefing.location ? (
            <p className="text-sm text-muted-foreground">{briefing.location}</p>
          ) : null}
        </div>
        <DetailHeaderActions
          briefing={briefing}
          preparedForLine={preparedForLine}
          meetingMetaLine={meetingMetaLine}
          liveBriefingUrl={liveBriefingUrl}
        />
      </div>
    </div>
  )
}
