import type { Item, Source } from '@shared/briefings/types'
import RecentNewsList from './RecentNewsList'
import TalkingPointsList from './TalkingPointsList'
import SourcesCollapsible from './SourcesCollapsible'
import FeedbackRow from './FeedbackRow'

type Props = {
  item: Item
  itemIndex: number
  sources: Source[]
  domId: string
  showFeedback: boolean
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[12px] font-bold uppercase tracking-wide text-foreground">
      {children}
    </span>
  )
}

/**
 * One item card on the briefing detail page. Sections rendered, in order:
 * Summary, Constituent Sentiment, Recent News, Budget Impact, Talking Points,
 * Sources collapsible, feedback row.
 *
 * Every string rendered as body text carries a `data-briefing-json-path`
 * attribute so phase 4's selection toolbar can build an anchor that maps to
 * the v2 artifact shape.
 */
export default function AgendaItemCard({
  item,
  itemIndex,
  sources,
  domId,
  showFeedback,
}: Props): React.JSX.Element {
  const base = `/items/${itemIndex}`
  const display = item.display
  const sentiment = display.constituentSentiment
  const budget = display.budgetImpact
  const news = display.recentNews ?? []
  const talkingPoints = display.talkingPoints ?? []
  const sourceIds = display.sourceIds ?? []

  const sourceById = new Map(sources.map((s) => [s.id, s]))
  const itemSources = sourceIds
    .map((id) => sourceById.get(id))
    .filter((s): s is Source => Boolean(s))

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
        <SectionLabel>What to expect</SectionLabel>
        <p
          className="text-sm leading-6 text-foreground"
          data-briefing-json-path={`${base}/display/summary`}
        >
          {display.summary}
        </p>
      </section>

      {sentiment ? (
        <section className="flex flex-col gap-2">
          <SectionLabel>Constituent sentiment</SectionLabel>
          <p
            className="text-sm leading-6 text-foreground"
            data-briefing-json-path={`${base}/display/constituent_sentiment/summary`}
          >
            {sentiment.summary}
          </p>
          {sentiment.detail ? (
            <p
              className="text-sm leading-6 text-foreground"
              data-briefing-json-path={`${base}/display/constituent_sentiment/detail`}
            >
              {sentiment.detail}
            </p>
          ) : null}
        </section>
      ) : null}

      {news.length > 0 ? (
        <section className="flex flex-col gap-2">
          <SectionLabel>Recent news</SectionLabel>
          <RecentNewsList
            items={news}
            pathPrefix={`${base}/display/recent_news`}
          />
        </section>
      ) : null}

      {budget ? (
        <section className="flex flex-col gap-2">
          <SectionLabel>Budget impact</SectionLabel>
          <p
            className="text-sm leading-6 text-foreground"
            data-briefing-json-path={`${base}/display/budget_impact/summary`}
          >
            {budget.summary}
          </p>
        </section>
      ) : null}

      {talkingPoints.length > 0 ? (
        <section className="flex flex-col gap-2">
          <SectionLabel>Talking points</SectionLabel>
          <TalkingPointsList
            points={talkingPoints}
            pathPrefix={`${base}/display/talking_points`}
          />
        </section>
      ) : null}

      <SourcesCollapsible sources={itemSources} />
      {showFeedback ? <FeedbackRow /> : null}
    </article>
  )
}
