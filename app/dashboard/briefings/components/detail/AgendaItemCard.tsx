import type { ActionItem } from '@shared/briefings/types'
import SourceButton from './SourceButton'
import RecentNewsList from './RecentNewsList'
import TalkingPointsList from './TalkingPointsList'
import SourcesCollapsible from './SourcesCollapsible'
import FeedbackRow from './FeedbackRow'

type Props = {
  item: ActionItem
  index: number
  domId: string
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[12px] font-bold uppercase tracking-wide text-foreground">
      {children}
    </span>
  )
}

/**
 * One agenda item card on the briefing detail page.
 *
 * Sections rendered, in order: Overview, Constituent Sentiment, Recent News,
 * Budget Impact, Talking Points, Sources collapsible, feedback row.
 *
 * The Constituent Quote section is intentionally not rendered (out of scope).
 *
 * Every string rendered as body text carries a `data-briefing-json-path`
 * attribute so phase 4's selection toolbar can build an anchor.
 */
export default function AgendaItemCard({
  item,
  index,
  domId,
}: Props): React.JSX.Element {
  const base = `/actionItems/${index}`
  const sentiment = item.constituentSentiment
  const budget = item.budgetImpact

  const sourceById = new Map(item.sources.map((s) => [s.id, s]))

  function inlineSourcesFor(ids: string[]): React.ReactNode {
    if (ids.length === 0) return null
    return (
      <p className="inline-flex flex-wrap items-center gap-1.5 text-xs leading-5 text-muted-foreground">
        <em className="italic">source:</em>
        {ids.map((id) => {
          const s = sourceById.get(id)
          if (!s) return null
          return <SourceButton key={id} source={s} />
        })}
      </p>
    )
  }

  return (
    <article
      id={domId}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
    >
      <header className="flex flex-col gap-1">
        <span className="text-[12px] font-bold uppercase tracking-wide text-primary">
          Agenda item
        </span>
        <h3
          className="text-lg font-semibold text-foreground"
          data-briefing-json-path={`${base}/title`}
        >
          {item.title}
        </h3>
      </header>

      <section className="flex flex-col gap-2">
        <SectionLabel>Overview</SectionLabel>
        <p
          className="text-sm leading-6 text-foreground"
          data-briefing-json-path={`${base}/overview`}
        >
          {item.overview}
        </p>
      </section>

      {sentiment ? (
        <section className="flex flex-col gap-2">
          <SectionLabel>Constituent sentiment</SectionLabel>
          <p
            className="text-sm leading-6 text-foreground"
            data-briefing-json-path={`${base}/constituentSentiment/summary`}
          >
            {sentiment.summary}
          </p>
          {sentiment.detail ? (
            <p
              className="text-sm leading-6 text-foreground"
              data-briefing-json-path={`${base}/constituentSentiment/detail`}
            >
              {sentiment.detail}
            </p>
          ) : null}
          {inlineSourcesFor(sentiment.sources)}
        </section>
      ) : null}

      {item.recentNews.length > 0 ? (
        <section className="flex flex-col gap-2">
          <SectionLabel>Recent news</SectionLabel>
          <RecentNewsList
            items={item.recentNews}
            pathPrefix={`${base}/recentNews`}
          />
        </section>
      ) : null}

      {budget ? (
        <section className="flex flex-col gap-2">
          <SectionLabel>Budget impact</SectionLabel>
          <p
            className="text-sm leading-6 text-foreground"
            data-briefing-json-path={`${base}/budgetImpact/summary`}
          >
            {budget.summary}
          </p>
          {inlineSourcesFor(budget.sources)}
        </section>
      ) : null}

      {item.talkingPoints.length > 0 ? (
        <section className="flex flex-col gap-2">
          <SectionLabel>Talking points</SectionLabel>
          <TalkingPointsList
            points={item.talkingPoints}
            pathPrefix={`${base}/talkingPoints`}
          />
        </section>
      ) : null}

      <SourcesCollapsible sources={item.sources} />
      <FeedbackRow />
    </article>
  )
}
