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
 * The active entry is whichever card the user most recently clicked —
 * via the legend or via the card itself. General scrolling does NOT
 * change the active card, so the legend stays in sync with user intent
 * rather than scroll position.
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
      {entries.map((e) => {
        const isActive = activeCard?.key === e.key
        return (
          <li key={e.key}>
            <a
              href={`#${e.domId}`}
              onClick={(ev) => onJump(ev, e)}
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
