import BriefingListRow from './BriefingListRow'
import AwaitingAgendaRow from './AwaitingAgendaRow'
import type { BriefingSummary } from '@shared/briefings/types'

type Props = {
  title: string
  summaries: BriefingSummary[]
}

/**
 * A list-of-briefings card. Used on the landing page below the
 * Upcoming countdown card to render the rest of the upcoming briefings.
 *
 * Renders nothing if `summaries` is empty.
 */
export default function BriefingListSection({
  title,
  summaries,
}: Props): React.JSX.Element | null {
  if (summaries.length === 0) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <div className="divide-y divide-border">
        {summaries.map((s) =>
          s.status === 'awaiting_agenda' ? (
            <AwaitingAgendaRow key={s.id} summary={s} />
          ) : (
            <BriefingListRow key={s.id} summary={s} />
          ),
        )}
      </div>
    </div>
  )
}
