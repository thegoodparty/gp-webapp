import type { AgendaItem } from '@shared/briefings/types'

type Props = {
  item: AgendaItem
  domId: string
  agendaIndex: number
}

/**
 * Card for an agenda item that does not have a full action briefing.
 * Shows the title and, when available, a short "What to expect" line.
 *
 * Procedural, consent, public input, and informational items render this
 * card so the TOC has a target to scroll to and so every agenda item is
 * visible in order on the detail page.
 */
export default function SlimAgendaCard({
  item,
  domId,
  agendaIndex,
}: Props): React.JSX.Element {
  const base = `/agenda/${agendaIndex}`
  return (
    <article
      id={domId}
      className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-6"
    >
      <header className="flex flex-col gap-1">
        <span className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
          Agenda item
        </span>
        <h3
          className="text-lg font-semibold text-foreground"
          data-briefing-json-path={`${base}/title`}
        >
          {item.title}
        </h3>
      </header>
      {item.whatToExpect ? (
        <section className="flex flex-col gap-2">
          <span className="text-[12px] font-bold uppercase tracking-wide text-foreground">
            What to expect
          </span>
          <p
            className="text-sm leading-6 text-foreground"
            data-briefing-json-path={`${base}/whatToExpect`}
          >
            {item.whatToExpect}
          </p>
        </section>
      ) : null}
    </article>
  )
}
