import UpcomingCountdownCard from './UpcomingCountdownCard'
import BriefingListSection from './BriefingListSection'
import type { BriefingSummary } from '@shared/briefings/types'

type Props = {
  summaries: BriefingSummary[]
}

function compareScheduledAt(a: BriefingSummary, b: BriefingSummary): number {
  return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
}

/**
 * Briefings landing page.
 *
 * Top: full-width page header with title and subtitle.
 * Middle: UPCOMING countdown callout for the nearest upcoming briefing.
 * Bottom: list of remaining upcoming briefings.
 *
 * Past briefings are intentionally not rendered in v1.
 */
export default function BriefingsLanding({
  summaries,
}: Props): React.JSX.Element {
  const sorted = [...summaries].sort(compareScheduledAt)
  const featured = sorted[0]
  const rest = sorted.slice(1)

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <div className="flex w-full flex-col items-start gap-4 border-b border-border bg-background px-6 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex min-w-0 flex-1 flex-col">
          <h1 className="text-base font-semibold text-foreground">
            Be prepared for your meetings
          </h1>
          <p className="text-sm font-normal text-muted-foreground">
            See your briefings and add notes
          </p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-4 pb-20 pt-6 lg:px-0">
        {featured ? <UpcomingCountdownCard summary={featured} /> : null}
        <BriefingListSection title="Upcoming" summaries={rest} />
      </div>
    </div>
  )
}
