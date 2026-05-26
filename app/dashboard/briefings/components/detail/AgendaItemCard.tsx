'use client'

import { useRef, useState } from 'react'
import type { Item, Source } from '@shared/briefings/types'
import { Popover, PopoverContent, PopoverTrigger } from '@styleguide'
import { ExternalLink } from 'lucide-react'
import {
  toDisplaySource,
  type DisplaySource,
} from '@shared/briefings/displaySource'
import RecentNewsList from './RecentNewsList'
import TalkingPointsList from './TalkingPointsList'
import SourcesCollapsible from './SourcesCollapsible'
import FeedbackRow from './FeedbackRow'
import ReadAloudButton from './ReadAloudButton'

type Variant = 'full' | 'whatToExpectOnly'

type Props = {
  item: Item
  itemIndex: number
  sources: Source[]
  domId: string
  meetingDate: string
  showFeedback: boolean
  variant?: Variant
  /**
   * Pre-rendered plain-text for the speech service. When provided, the
   * card header renders a compact read-aloud control. Featured items on
   * the overview pass this; non-featured items omit it.
   */
  speechText?: string
  /** Optional label forwarded to analytics so usage can be sliced by surface. */
  analyticsLabel?: string
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[12px] font-bold uppercase tracking-wide text-foreground">
    {children}
  </span>
)

const PILL_CLASS =
  'inline-flex max-w-[180px] items-center gap-1 rounded-sm bg-muted/60 px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground'

const SourcePill = ({ source }: { source: DisplaySource }) => {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }
  const handleEnter = () => {
    cancelClose()
    setOpen(true)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        className={PILL_CLASS}
        title={source.displayLabel}
        onMouseEnter={handleEnter}
        onMouseLeave={scheduleClose}
      >
        <span
          aria-hidden
          className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-sm bg-primary/15 text-[9px] font-bold text-primary"
        >
          {source.initial}
        </span>
        <span className="truncate">{source.displayLabel}</span>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={6}
        className="w-80 rounded-xl p-3 text-sm"
        onMouseEnter={handleEnter}
        onMouseLeave={scheduleClose}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-3 text-left">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Source</span>
            <span>1 source</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm bg-primary/15 text-[10px] font-bold text-primary"
              >
                {source.initial}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                {source.publisher}
              </span>
            </div>
            {source.isProprietary ? (
              <span className="text-sm font-semibold text-foreground">
                {source.displayName}
              </span>
            ) : source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1 text-sm font-semibold leading-5 text-info-600 hover:underline"
              >
                <span>{source.displayName}</span>
                <ExternalLink aria-hidden className="mt-1 size-3 shrink-0" />
              </a>
            ) : (
              <span className="text-sm font-semibold text-foreground">
                {source.displayName}
              </span>
            )}
            {source.description ? (
              <p className="text-xs leading-5 text-muted-foreground">
                {source.description}
              </p>
            ) : null}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

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
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
      <span className="italic text-muted-foreground">source:</span>
      {resolved.map((s) => (
        <SourcePill key={s.id} source={s} />
      ))}
    </div>
  )
}

const formatSentimentLine = (meanScore: number): string => {
  const support = Math.round(meanScore)
  const oppose = 100 - support
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
  speechText,
  analyticsLabel,
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
      className="flex scroll-mt-[104px] flex-col gap-4 rounded-2xl border border-border bg-card p-6 lg:scroll-mt-3"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3
            className="text-lg font-semibold text-foreground"
            data-briefing-json-path={`${base}/title`}
          >
            {item.title}
          </h3>
        </div>
        {speechText ? (
          <ReadAloudButton
            text={speechText}
            analyticsLabel={analyticsLabel}
            compact
          />
        ) : null}
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

          {itemSources.length > 0 ? (
            <div className="border-y border-border py-2">
              <SourcesCollapsible sources={itemSources} />
            </div>
          ) : null}
          {showFeedback ? (
            <FeedbackRow meetingDate={meetingDate} itemId={item.id} />
          ) : null}
        </>
      )}
    </article>
  )
}

export default AgendaItemCard
