'use client'

import { MeetingBriefingOutput } from 'gpApi/generated/agent-job-contracts'
import {
  BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
  briefingItemDomId,
} from '@shared/briefings/routes'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'
import CardLevelNotesList from './CardLevelNotesList'
import ReadAloudButton from './ReadAloudButton'

type Props = {
  summary: MeetingBriefingOutput['executive_summary']
  domId: string
  /**
   * Pre-rendered plain-text version of the briefing for the speech
   * service. Built by the page via `renderBriefingForSpeech` and
   * threaded down so the read-aloud control stays a thin UI shell.
   */
  speechText: string
  /** Optional label forwarded to analytics so usage can be sliced by surface. */
  analyticsLabel?: string
}

const onJump = (
  e: React.MouseEvent<HTMLAnchorElement>,
  domId: string,
): void => {
  if (typeof window === 'undefined') return
  const target = document.getElementById(domId)
  if (!target) return
  e.preventDefault()
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', `#${domId}`)
  }
}

/**
 * First card on the briefing detail page. Renders the executive summary's
 * lead-in followed by a bulleted list of featured items; each item title
 * links to the corresponding agenda-item card via in-page scroll.
 */
export default function ExecutiveSummaryCard({
  summary,
  domId,
  speechText,
  analyticsLabel,
}: Props): React.JSX.Element {
  const { activeCard, setActiveCard } = useAnnotationsCtx()
  const isActive = activeCard?.key === domId
  const activate = () =>
    setActiveCard({
      key: domId,
      jsonPath: BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
      title: 'Executive Summary',
    })
  return (
    <article
      id={domId}
      onClick={activate}
      aria-current={isActive ? 'true' : undefined}
      className={`flex scroll-mt-[104px] cursor-pointer flex-col gap-3 rounded-2xl border bg-card p-6 transition-colors lg:scroll-mt-3 ${
        isActive
          ? 'border-info-600 ring-2 ring-info-600/40'
          : 'border-border hover:border-foreground/20'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-2xl font-semibold text-foreground">
          Executive Summary
        </h2>
        <ReadAloudButton text={speechText} analyticsLabel={analyticsLabel} />
      </div>
      <p
        className="text-sm text-muted-foreground"
        data-briefing-json-path="/executive_summary/lead_in"
      >
        {summary.lead_in}
      </p>
      {summary.items.length > 0 ? (
        <ul className="list-disc! flex flex-col gap-2 pl-5 text-sm leading-6">
          {summary.items.map((item, i) => {
            const itemDomId = briefingItemDomId(item.item_id)
            return (
              <li
                key={item.item_id}
                className="list-item!"
                data-briefing-json-path={`/executive_summary/items/${i}`}
              >
                <a
                  href={`#${itemDomId}`}
                  onClick={(e) => onJump(e, itemDomId)}
                  className="font-semibold text-info-600 hover:underline"
                >
                  {item.title}
                </a>
                <span className="text-muted-foreground">
                  {' '}
                  — {item.overview}
                </span>
              </li>
            )
          })}
        </ul>
      ) : null}
      <CardLevelNotesList cardPath={BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH} />
    </article>
  )
}
