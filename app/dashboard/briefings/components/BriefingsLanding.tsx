import { CalendarClock } from 'lucide-react'
import UpcomingCountdownCard from './UpcomingCountdownCard'
import BriefingListSection from './BriefingListSection'
import type { BriefingSummary } from '@shared/briefings/types'

type Props = {
  summaries: BriefingSummary[]
}

const MAX_UPCOMING = 5
const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000

const distanceFromNow = (s: BriefingSummary): number =>
  Math.abs(new Date(s.scheduledAt).getTime() - Date.now())

const compareScheduledAt = (a: BriefingSummary, b: BriefingSummary): number =>
  new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()

const isFeaturedEligible = (s: BriefingSummary): boolean => {
  const t = new Date(s.scheduledAt).getTime()
  const now = Date.now()
  if (t >= now) return true
  return s.status === 'briefing_ready' && now - t <= FOUR_DAYS_MS
}

const EmptyState = () => (
  <section className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
    <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
      <CalendarClock className="size-5" aria-hidden />
    </span>
    <h2 className="text-xl font-semibold leading-7 text-foreground">
      We&apos;re tracking down your meetings
    </h2>
    <p className="text-sm text-muted-foreground">
      We&apos;re finding your upcoming council meetings and building briefings
      from the public agenda packets. As soon as the first one is ready,
      we&apos;ll email you so you can review it before you walk in.
    </p>
  </section>
)

export default function BriefingsLanding({
  summaries,
}: Props): React.JSX.Element {
  const featured = summaries
    .filter(isFeaturedEligible)
    .sort((a, b) => distanceFromNow(a) - distanceFromNow(b))[0]

  const upcoming = summaries
    .filter(
      (s) =>
        s.id !== featured?.id &&
        new Date(s.scheduledAt).getTime() >= Date.now(),
    )
    .sort(compareScheduledAt)
    .slice(0, MAX_UPCOMING)

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
        {featured ? (
          <>
            <UpcomingCountdownCard summary={featured} />
            <BriefingListSection title="Upcoming" summaries={upcoming} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
