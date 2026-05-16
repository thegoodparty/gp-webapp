import type { Item, Source } from '@shared/briefings/types'
import { Popover, PopoverContent, PopoverTrigger } from '@styleguide'
import { toDisplaySource } from '@shared/briefings/displaySource'
import RecentNewsList from './RecentNewsList'
import TalkingPointsList from './TalkingPointsList'
import SourcesCollapsible from './SourcesCollapsible'
import FeedbackRow from './FeedbackRow'

type Variant = 'full' | 'whatToExpectOnly'

type Props = {
  item: Item
  itemIndex: number
  sources: Source[]
  domId: string
  meetingDate: string
  showFeedback: boolean
  variant?: Variant
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[12px] font-bold uppercase tracking-wide text-foreground">
    {children}
  </span>
)

const SectionSourcePills = ({
  sourceIds,
  sourceById,
}: {
  sourceIds: string[]
  sourceById: Map<string, Source>
}): React.JSX.Element | null => {
  const resolved = sourceIds
    .map((id) => sourceById.get(id))
    .filter((s): s is Source => Boolean(s))
    .map(toDisplaySource)
  if (resolved.length === 0) return null
  const pillClass =
    'inline-flex max-w-[200px] items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-foreground'
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
      <span className="italic text-muted-foreground">source:</span>
      {resolved.map((s) => {
        const inner = (
          <>
            <span
              aria-hidden
              className="inline-flex size-4 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary"
            >
              {s.initial}
            </span>
            <span className="truncate font-medium">{s.displayName}</span>
          </>
        )
        if (s.isProprietary) {
          return (
            <Popover key={s.id}>
              <PopoverTrigger
                className={`${pillClass} hover:bg-muted`}
                title={s.displayName}
              >
                {inner}
              </PopoverTrigger>
              <PopoverContent className="w-72 text-sm">
                <p className="font-medium text-foreground">{s.displayName}</p>
                {s.displayBlurb ? (
                  <p className="mt-1 text-muted-foreground">{s.displayBlurb}</p>
                ) : null}
              </PopoverContent>
            </Popover>
          )
        }
        return s.url ? (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${pillClass} hover:bg-muted`}
            title={s.displayName}
          >
            {inner}
          </a>
        ) : (
          <span key={s.id} className={pillClass} title={s.displayName}>
            {inner}
          </span>
        )
      })}
    </div>
  )
}

const formatSentimentLine = (meanScore: number): string => {
  const support = Math.round(meanScore)
  const oppose = Math.round(100 - meanScore)
  return `${support}% support · ${oppose}% oppose`
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
const AgendaItemCard = ({
  item,
  itemIndex,
  sources,
  domId,
  meetingDate,
  showFeedback,
  variant = 'full',
}: Props): React.JSX.Element => {
  const base = `/items/${itemIndex}`
  const display = item.display
  const sentiment = display.constituentSentiment
  const budget = display.budgetImpact
  const news = display.recentNews ?? []
  const talkingPoints = display.talkingPoints ?? []

  const sourceById = new Map(sources.map((s) => [s.id, s]))

  const aggregatedSourceIds = [
    ...(display.sourceIds ?? []),
    ...(sentiment?.sourceIds ?? []),
    ...(budget?.sourceIds ?? []),
  ]
  const uniqueIds = Array.from(new Set(aggregatedSourceIds))
  const itemSources = uniqueIds
    .map((id) => sourceById.get(id))
    .filter((s): s is Source => Boolean(s))

  const isWhatToExpectOnly = variant === 'whatToExpectOnly'

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

      {isWhatToExpectOnly ? null : (
        <>
          {sentiment ? (
            <section className="flex flex-col gap-2">
              <SectionLabel>Constituent sentiment</SectionLabel>
              {sentiment.haystaqStatus === 'ok' &&
              typeof sentiment.meanScore === 'number' ? (
                <p className="text-sm font-semibold text-foreground">
                  {formatSentimentLine(sentiment.meanScore)}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No sentiment data yet for {item.title}.
                </p>
              )}
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
              {sentiment.sourceIds.length > 0 ? (
                <SectionSourcePills
                  sourceIds={sentiment.sourceIds}
                  sourceById={sourceById}
                />
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
              {budget.sourceIds.length > 0 ? (
                <SectionSourcePills
                  sourceIds={budget.sourceIds}
                  sourceById={sourceById}
                />
              ) : null}
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
          {showFeedback ? (
            <FeedbackRow meetingDate={meetingDate} itemId={item.id} />
          ) : null}
        </>
      )}
    </article>
  )
}

export default AgendaItemCard
