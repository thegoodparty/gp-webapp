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

// Where the "active line" sits inside the scroll container. Activation
// fires when a card's top crosses (i.e. scrolls above) this line — so a
// large fraction means the card has to be substantially in view before
// it becomes active, avoiding the jitter where merely revealing the
// bottom of card N+1 prematurely activated it. 35% of the container
// height feels close to "the user is reading this card now," matching
// the behaviour of standard docs scroll-spies.
const ACTIVE_LINE_FRACTION = 0.35
// Mobile scroll uses the document, so the sticky DetailHeader sits on
// top of the viewport. Reserve its height before applying the fraction
// so the active line lands inside the visible briefing content.
const MOBILE_HEADER_BAND = 88

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
      const containerRect = paneScrolls
        ? pane.getBoundingClientRect()
        : { top: 0, height: window.innerHeight }
      const containerTop = containerRect.top
      const visibleHeight = paneScrolls
        ? containerRect.height
        : Math.max(0, window.innerHeight - MOBILE_HEADER_BAND)
      // Active line sits ~a third of the way down the visible scroll
      // area. A card becomes active only once its top has scrolled past
      // this line — i.e. it's been "read into" by the user, not merely
      // peeking up from the bottom of the viewport.
      const offset = Math.max(40, visibleHeight * ACTIVE_LINE_FRACTION)

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

    // Sync once on mount so deep-link hashes, browser scroll restoration,
    // and Next.js scroll preservation don't leave the active card stuck
    // on whichever card was the layout default (usually Executive
    // Summary). Defer to the next frame so layout has settled and DOM
    // measurements are correct.
    raf = requestAnimationFrame(pick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      pane?.removeEventListener('scroll', onScroll)
      if (raf !== 0) cancelAnimationFrame(raf)
    }
  }, [entries, setActiveCard])

  return null
}
