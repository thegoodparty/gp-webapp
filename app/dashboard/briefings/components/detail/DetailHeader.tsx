import Link from 'next/link'
import { ArrowLeftIcon } from '@styleguide'
import { briefingsLandingHref } from '@shared/briefings/routes'
import { formatBriefingMeetingDate } from '@shared/briefings/dateHelpers'
import type { Briefing } from '@shared/briefings/types'
import DetailHeaderActions from './DetailHeaderActions'

type Props = {
  briefing: Briefing
}

/**
 * Sticky top bar on the briefing detail page. Layout matches the Lovable
 * design:
 *  - Small back-arrow link on the far left.
 *  - Three-line title block: meeting body name, formatted meeting date,
 *    location. Meeting time is intentionally omitted until the
 *    MeetingBriefingFull contract exposes it.
 *  - Desktop-only Share / Add note / Briefing assistant buttons on the
 *    right (mobile equivalents live in MobileBottomBar).
 */
export default function DetailHeader({ briefing }: Props): React.JSX.Element {
  const formattedDate = formatBriefingMeetingDate(briefing.meeting_date)
  return (
    <div className="sticky top-0 z-20 border-b border-border bg-sidebar">
      {/* Match the body's content container (mx-auto max-w-[1120px] + same
          padding) so the back arrow and Share button line up with the cards
          below instead of sitting against the viewport edges. */}
      <div className="mx-auto flex w-full max-w-[1120px] items-start gap-3 px-4 py-4 lg:px-8">
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
        <DetailHeaderActions />
      </div>
    </div>
  )
}
