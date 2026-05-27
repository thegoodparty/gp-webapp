'use client'

import { useEffect, useMemo, useRef } from 'react'
import {
  BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
  BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
  briefingItemCardPath,
  briefingItemDomId,
} from '@shared/briefings/routes'
import type { Item } from '@shared/briefings/types'
import {
  useAnnotationsCtx,
  type ActiveCard,
} from '../annotations/AnnotationsScope'

type Props = {
  items: Item[]
}

type Entry = ActiveCard & { domId: string }

// Active line offsets, mirroring CardLevelNotesList / scroll-mt: the
// document-scroll model on mobile lands cards 104px below the viewport
// (under the sticky DetailHeader); the pane-scroll model at lg+ has no
// sticky header inside the pane, so a much smaller breathing margin
// (12px) is enough to mark a card as "in view."
const MOBILE_HEADER_OFFSET = 104
const DESKTOP_PANE_OFFSET = 12

/**
 * Watches the briefing scroll container and updates `activeCard` to
 * whichever card is currently at the top of the viewport. Pure side
 * effect — renders nothing. Mount once near the layout root and pass the
 * briefing items in so we can address them by domId / jsonPath.
 *
 * The spy intentionally does NOT scroll; it only reads scroll position.
 * Activation via card click and legend click stays in those components
 * and continues to work — the spy then takes over as the user scrolls.
 */
export default function ActiveCardScrollSpy({
  items,
}: Props): React.JSX.Element | null {
  const { activeCard, setActiveCard } = useAnnotationsCtx()
  const entries: Entry[] = useMemo(() => {
    const list: Entry[] = [
      {
        key: BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
        jsonPath: BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
        title: 'Executive Summary',
        domId: BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
      },
    ]
    items.forEach((item, idx) => {
      list.push({
        key: briefingItemDomId(item.id),
        jsonPath: briefingItemCardPath(idx),
        title: item.title,
        domId: briefingItemDomId(item.id),
      })
    })
    return list
  }, [items])

  // Latest activeCard.key without forcing the effect to re-bind whenever
  // it changes — we read it inside the listener to decide whether to
  // dispatch a new setActiveCard.
  const activeKeyRef = useRef<string | null>(activeCard?.key ?? null)
  useEffect(() => {
    activeKeyRef.current = activeCard?.key ?? null
  }, [activeCard])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (entries.length === 0) return

    const pane = document.getElementById('briefing-detail-pane')
    let raf = 0

    function pick() {
      raf = 0
      const paneScrolls =
        !!pane && window.matchMedia('(min-width: 1024px)').matches
      const containerTop = paneScrolls ? pane.getBoundingClientRect().top : 0
      const offset = paneScrolls ? DESKTOP_PANE_OFFSET : MOBILE_HEADER_OFFSET

      // Pick the card whose top sits closest to (but above) the offset
      // line. Same algorithm the legend used to drive its dot indicator,
      // now centralized so card outline + legend stay in sync via the
      // shared `activeCard` state.
      let bestKey = entries[0]?.key ?? null
      let bestTop = -Infinity
      for (const e of entries) {
        const el = document.getElementById(e.domId)
        if (!el) continue
        const top = el.getBoundingClientRect().top - containerTop
        if (top - offset <= 1 && top > bestTop) {
          bestTop = top
          bestKey = e.key
        }
      }

      if (bestKey === null || bestKey === activeKeyRef.current) return
      const matched = entries.find((e) => e.key === bestKey)
      if (!matched) return
      setActiveCard({
        key: matched.key,
        jsonPath: matched.jsonPath,
        title: matched.title,
      })
    }

    function onScroll() {
      if (raf === 0) raf = requestAnimationFrame(pick)
    }

    // Mobile uses the document scroll; desktop scrolls the right pane.
    // Element scroll events don't bubble, so we attach to both. resize
    // is included because crossing the lg breakpoint changes which
    // container scrolls.
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    pane?.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      pane?.removeEventListener('scroll', onScroll)
      if (raf !== 0) cancelAnimationFrame(raf)
    }
  }, [entries, setActiveCard])

  return null
}
