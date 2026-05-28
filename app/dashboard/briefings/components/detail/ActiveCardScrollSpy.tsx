'use client'

import { useEffect, useMemo, useRef } from 'react'
import {
  BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
  BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
  BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH,
  briefingItemCardPath,
  briefingItemDomId,
  briefingItemTitlePath,
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

// Once an external `setActiveCard` fires (TOC click, card body click), the
// spy locks itself off while the smooth-scroll plays out so its
// scroll-driven picks don't fight the user's destination. A single
// timer governs the lock lifecycle:
//   - Set to LOCK_MAX_MS at lock activation. This is the safety net for
//     the "destination already in view, no scroll events fire" case.
//   - Reset to SCROLL_SETTLE_MS on every scroll event during the lock.
//     Once scroll events stop arriving for SCROLL_SETTLE_MS, the
//     programmatic smooth-scroll has finished and the lock releases.
const SCROLL_SETTLE_MS = 200
const LOCK_MAX_MS = 1500

/**
 * Watches the briefing scroll container and updates `activeCard` to
 * whichever card is currently at the top of the viewport. Pure side
 * effect — renders nothing. Mount once near the layout root and pass the
 * briefing items in so we can address them by domId / jsonPath.
 *
 * The spy intentionally does NOT scroll; it only reads scroll position.
 * Activation via TOC click and card click sets `activeCard` directly and
 * the spy backs off for the duration of the smooth-scroll so it doesn't
 * rewind the highlight to the card currently at the active line.
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
        titleJsonPath: BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH,
        title: 'Executive Summary',
        domId: BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
      },
    ]
    items.forEach((item, idx) => {
      list.push({
        key: briefingItemDomId(item.id),
        jsonPath: briefingItemCardPath(idx),
        titleJsonPath: briefingItemTitlePath(idx),
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

  // Lock state shared between the activation effect (below) and the
  // scroll-watch effect (further down).
  const lastSpyPickKeyRef = useRef<string | null>(null)
  const isLockedRef = useRef(false)
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // The scroll-watch effect publishes its `pick` function here so the
  // lock release path can run a final pick to sync the highlight to the
  // actual landed scroll position.
  const runPickRef = useRef<(() => void) | null>(null)

  // Activate the lock whenever `activeCard` changes to a key the spy
  // didn't dispatch itself. Start the safety timer immediately so the
  // lock releases even if no scroll events ever arrive (e.g. clicking a
  // TOC entry whose target is already in view).
  //
  // First run is treated as "the spy already agrees" so an initial
  // hash-deep-link doesn't suppress the mount-time sync pick.
  const hasInitedActiveSyncRef = useRef(false)
  useEffect(() => {
    if (!hasInitedActiveSyncRef.current) {
      hasInitedActiveSyncRef.current = true
      lastSpyPickKeyRef.current = activeCard?.key ?? null
      return
    }
    if (!activeCard) return
    if (activeCard.key === lastSpyPickKeyRef.current) return
    isLockedRef.current = true
    if (lockTimerRef.current !== null) clearTimeout(lockTimerRef.current)
    lockTimerRef.current = setTimeout(() => {
      isLockedRef.current = false
      lockTimerRef.current = null
      runPickRef.current?.()
    }, LOCK_MAX_MS)
  }, [activeCard])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (entries.length === 0) return

    const pane = document.getElementById('briefing-detail-pane')
    let raf = 0

    function pick() {
      raf = 0
      if (isLockedRef.current) return
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
      lastSpyPickKeyRef.current = matched.key
      setActiveCard({
        key: matched.key,
        jsonPath: matched.jsonPath,
        titleJsonPath: matched.titleJsonPath,
        title: matched.title,
      })
    }

    runPickRef.current = () => {
      if (raf === 0) raf = requestAnimationFrame(pick)
    }

    function onScroll() {
      if (isLockedRef.current) {
        // While locked, scroll events restart the timer with the shorter
        // settle window. The lock releases SCROLL_SETTLE_MS after the
        // last scroll event — i.e. once the programmatic smooth-scroll
        // has finished. The original LOCK_MAX_MS countdown was a safety
        // net for the no-scroll-events case; once scrolls start arriving
        // we can use a tighter bound.
        if (lockTimerRef.current !== null) clearTimeout(lockTimerRef.current)
        lockTimerRef.current = setTimeout(() => {
          isLockedRef.current = false
          lockTimerRef.current = null
          if (raf === 0) raf = requestAnimationFrame(pick)
        }, SCROLL_SETTLE_MS)
        return
      }
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
      runPickRef.current = null
    }
  }, [entries, setActiveCard])

  return null
}
