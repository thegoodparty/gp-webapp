'use client'

import { useMemo } from 'react'
import {
  BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
  BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
  BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH,
  briefingItemCardPath,
  briefingItemDomId,
  briefingItemTitlePath,
} from '@shared/briefings/routes'
import type { Item } from '@shared/briefings/types'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

type Props = {
  briefingSlug: string
  items: Item[]
}

type Entry = {
  key: string
  label: string
  domId: string
  jsonPath: string
  titleJsonPath: string
}

/**
 * Sidebar TOC. All agenda items render inline on the briefing detail
 * page, so the TOC scrolls within the page rather than navigating.
 *
 * Clicking an entry immediately marks it active and starts the
 * smooth-scroll. `ActiveCardScrollSpy` detects the external set, locks
 * itself off so the spy doesn't fight the click destination during the
 * scroll, and resumes scroll-driven updates once the scroll settles.
 */
export default function DetailToc({
  briefingSlug,
  items,
}: Props): React.JSX.Element {
  const { activeCard, setActiveCard } = useAnnotationsCtx()

  const entries: Entry[] = useMemo(() => {
    const list: Entry[] = [
      {
        key: BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
        label: 'Executive Summary',
        domId: BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
        jsonPath: BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
        titleJsonPath: BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH,
      },
    ]
    items.forEach((item, idx) => {
      list.push({
        key: briefingItemDomId(item.id),
        label: item.title,
        domId: briefingItemDomId(item.id),
        jsonPath: briefingItemCardPath(idx),
        titleJsonPath: briefingItemTitlePath(idx),
      })
    })
    return list
  }, [items])

  function onJump(e: React.MouseEvent<HTMLAnchorElement>, entry: Entry) {
    if (typeof window === 'undefined') return
    e.preventDefault()
    // Set active immediately so the highlight tracks user intent. The
    // scrollspy detects an external set and locks during the smooth-
    // scroll so it doesn't fight back as the page passes intermediate
    // cards.
    setActiveCard({
      key: entry.key,
      jsonPath: entry.jsonPath,
      titleJsonPath: entry.titleJsonPath,
      title: entry.label,
    })
    const target = document.getElementById(entry.domId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `#${entry.domId}`)
    }
  }

  return (
    <ul className="flex list-none flex-col gap-0.5" data-testid={briefingSlug}>
      {entries.map((e, index) => {
        const isActive = activeCard?.key === e.key
        const entryType =
          e.key === BRIEFING_EXECUTIVE_SUMMARY_DOM_ID
            ? 'executive_summary'
            : 'agenda_item'
        return (
          <li key={e.key}>
            <a
              href={`#${e.domId}`}
              onClick={(ev) => {
                trackEvent(EVENTS.BriefingAssistant.TocItemClicked, {
                  briefingSlug,
                  entryKey: e.key,
                  entryIndex: index,
                  entryType,
                })
                onJump(ev, e)
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm leading-5 transition-colors ${
                isActive
                  ? 'bg-muted font-semibold text-foreground'
                  : 'text-foreground hover:bg-muted/60'
              }`}
            >
              <span
                aria-hidden
                className={`size-2 shrink-0 rounded-full ${
                  isActive ? 'bg-info-600' : 'bg-transparent'
                }`}
              />
              <span className="min-w-0">{e.label}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
