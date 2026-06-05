'use client'

import { MeetingBriefingOutput } from 'gpApi/generated/agent-job-contracts'
import {
  BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
  BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH,
  briefingItemDomId,
} from '@shared/briefings/routes'
import { selectElementContents } from '@shared/briefings/anchorResolver'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'
import CardLevelNotesList from './CardLevelNotesList'

type Props = {
  summary: MeetingBriefingOutput['executive_summary']
  /**
   * Ordered list of agenda item ids from the top-level `items[]`. Used to
   * sort the executive summary's items into agenda order — the upstream
   * generator is supposed to emit them in that order already, but in
   * practice sometimes returns them out of sequence.
   */
  agendaItemIds: string[]
  domId: string
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
  agendaItemIds,
  domId,
}: Props): React.JSX.Element {
  const { activeCard, setActiveCard, annotations, openChatsSurface } =
    useAnnotationsCtx()
  const isActive = activeCard?.key === domId
  // If the assistant already has a thread anchored to this title, clicking
  // the title opens that thread directly rather than re-surfacing the
  // selection toolbar.
  const titleChat = annotations.find(
    (a) =>
      a.kind === 'chat' && a.jsonPath === BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH,
  )
  const activate = () =>
    setActiveCard({
      key: domId,
      jsonPath: BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
      titleJsonPath: BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH,
      title: 'Executive Summary',
    })
  const orderIndex = new Map(agendaItemIds.map((id, i) => [id, i]))
  const orderedItems = summary.items
    .map((item, originalIndex) => ({ item, originalIndex }))
    .sort((a, b) => {
      const ai = orderIndex.get(a.item.item_id) ?? Number.MAX_SAFE_INTEGER
      const bi = orderIndex.get(b.item.item_id) ?? Number.MAX_SAFE_INTEGER
      if (ai !== bi) return ai - bi
      return a.originalIndex - b.originalIndex
    })
  return (
    <article
      id={domId}
      onClick={activate}
      // Make the card root addressable in the cycler's DOM-order index.
      // Card-level notes carry this path; without it, the enricher
      // couldn't slot them into document order.
      data-anchor-json-path={BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH}
      aria-current={isActive ? 'true' : undefined}
      className={`flex scroll-mt-[104px] cursor-pointer flex-col gap-3 rounded-2xl border bg-card p-6 transition-colors lg:scroll-mt-3 ${
        isActive
          ? 'border-info-600 ring-2 ring-info-600/40'
          : 'border-border hover:border-foreground/20'
      }`}
    >
      {/* `data-anchor-json-path` makes the title resolvable as an anchor
          target — card-level chats hang off this element. With no chat yet,
          clicking selects its full text so the HighlightToolbar surfaces
          anchored to the title; with a chat, it opens that thread. */}
      <h2
        className="min-w-0 cursor-pointer text-2xl font-semibold text-foreground"
        data-anchor-json-path={BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH}
        onClick={(e) => {
          if (titleChat) {
            e.stopPropagation()
            openChatsSurface(titleChat.id)
          } else {
            selectElementContents(e.currentTarget)
          }
        }}
      >
        Executive Summary
      </h2>
      <p
        className="text-sm text-muted-foreground"
        data-anchor-json-path="/executive_summary/lead_in"
      >
        {summary.lead_in}
      </p>
      {orderedItems.length > 0 ? (
        <ul className="list-disc! flex flex-col gap-2 pl-5 text-sm leading-6">
          {orderedItems.map(({ item, originalIndex }) => {
            const itemDomId = briefingItemDomId(item.item_id)
            return (
              <li
                key={item.item_id}
                className="list-item!"
                data-anchor-json-path={`/executive_summary/items/${originalIndex}`}
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
