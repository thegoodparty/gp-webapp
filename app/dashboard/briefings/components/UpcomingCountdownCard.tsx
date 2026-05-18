import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { buttonVariants } from '@styleguide'
import { countdownLabel } from '@shared/briefings/dateHelpers'
import type { BriefingSummary } from '@shared/briefings/types'

type Props = {
  summary: BriefingSummary
}

/**
 * The featured callout at the top of the briefings landing page.
 *
 * Shown for the nearest upcoming briefing. Bordered card with a blue
 * UPCOMING countdown pill, meeting metadata, and a single "View briefing"
 * CTA. Only renders the View briefing CTA when the briefing is ready.
 */
export default function UpcomingCountdownCard({
  summary,
}: Props): React.JSX.Element {
  const label = countdownLabel(summary.scheduledAt)
  const ready = summary.status === 'briefing_ready'

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-card p-6 shadow-sm">
      {label ? (
        <div>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            Upcoming · {label}
          </span>
        </div>
      ) : null}

      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold leading-7 text-foreground">
          {summary.meetingName}
        </h2>
        <p className="text-sm text-muted-foreground">{summary.meetingDate}</p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" aria-hidden />
          {summary.location}
        </p>
      </div>

      {ready ? (
        <div className="pt-1">
          <Link
            href={`/dashboard/briefings/${summary.slug}`}
            className={buttonVariants()}
          >
            View briefing
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      ) : (
        <p className="pt-1 text-sm text-muted-foreground">
          The briefing will be available once the agenda is posted.
        </p>
      )}
    </section>
  )
}
