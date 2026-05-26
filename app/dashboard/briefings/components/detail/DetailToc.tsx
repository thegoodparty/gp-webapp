'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
  briefingItemDomId,
} from '@shared/briefings/routes'
import type { Item } from '@shared/briefings/types'

type Props = {
  briefingSlug: string
  items: Item[]
}

type Entry = {
  key: string
  label: string
  domId: string
}

// Distance below the top of the scroll container where the "current section"
// line is drawn. Mobile uses the document scroll and sits below the sticky
// DetailHeader (~88px + breathing room). Desktop scrolls inside the content
// pane, which has no internal sticky header, so the line is just below the
// pane's top edge. Both values track the corresponding `scroll-mt-*` on the
// card roots so scroll target alignment and active-state detection agree.
const MOBILE_HEADER_OFFSET = 104
const DESKTOP_PANE_OFFSET = 12

/**
 * Sidebar TOC. All agenda items render inline on the briefing detail
 * page, so the TOC scrolls within the page rather than navigating.
 *
 * Active state is a rAF-throttled scroll-spy: on every scroll frame we
 * pick the section whose top sits closest to (but above) the active-line
 * offset, measured relative to the active scroll container — `window` on
 * mobile, the `#briefing-detail-pane` element at lg+ where the pane owns
 * the scroll. One section is "active" per frame, so the highlight never
 * flickers during smooth scrolls.
 */
export default function DetailToc({
  briefingSlug,
  items,
}: Props): React.JSX.Element {
  const entries: Entry[] = useMemo(() => {
    const list: Entry[] = [
      {
        key: 'overview',
        label: 'Executive Summary',
        domId: BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
      },
    ]
    for (const item of items) {
      list.push({
        key: item.id,
        label: item.title,
        domId: briefingItemDomId(item.id),
      })
    }
    return list
  }, [items])

  const [activeKey, setActiveKey] = useState<string>(entries[0]?.key ?? '')
  // When a user clicks a TOC entry, pin that entry as active until they
  // perform a real manual scroll (wheel/touch/key). The smooth scroll
  // animation fires `scroll` events too, but doesn't fire wheel/touch/key
  // — so this lets the clicked entry stay highlighted even when the
  // scroll container can't bring its section all the way to the active
  // line (e.g. clicking one of the last entries when there isn't enough
  // remaining scroll room below it).
  const [pinnedKey, setPinnedKey] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (entries.length === 0) return

    let raf = 0
    const pane = document.getElementById('briefing-detail-pane')

    function pickActive() {
      raf = 0
      // Pick the scroll container live each frame so a resize across the
      // lg breakpoint switches modes without a remount.
      const paneScrolls =
        !!pane && window.matchMedia('(min-width: 1024px)').matches
      const containerTop = paneScrolls
        ? pane.getBoundingClientRect().top
        : 0
      const offset = paneScrolls ? DESKTOP_PANE_OFFSET : MOBILE_HEADER_OFFSET

      let bestKey = entries[0]?.key ?? ''
      let bestTop = -Infinity
      for (const e of entries) {
        const el = document.getElementById(e.domId)
        if (!el) continue
        // Section's top relative to the scroll container's top edge.
        const top = el.getBoundingClientRect().top - containerTop
        // Sections at or above the offset line are candidates. The one
        // closest to the line (largest top that's still <= offset) wins.
        if (top - offset <= 1 && top > bestTop) {
          bestTop = top
          bestKey = e.key
        }
      }
      setActiveKey(bestKey)
    }

    function onScroll() {
      if (raf === 0) raf = requestAnimationFrame(pickActive)
    }

    function onUserInput() {
      setPinnedKey(null)
    }

    // Listen on both window (mobile, where the document scrolls) and the
    // briefing content pane (desktop, where the right column scrolls
    // independently). Element scroll events don't bubble, so we have to
    // attach directly to the pane. Wheel/touch/key events clear any
    // click-pinned highlight — the smooth-scroll animation doesn't fire
    // them, so the pin survives the animation.
    pickActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('wheel', onUserInput, { passive: true })
    window.addEventListener('touchstart', onUserInput, { passive: true })
    window.addEventListener('keydown', onUserInput)
    pane?.addEventListener('scroll', onScroll, { passive: true })
    pane?.addEventListener('wheel', onUserInput, { passive: true })
    pane?.addEventListener('touchstart', onUserInput, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('wheel', onUserInput)
      window.removeEventListener('touchstart', onUserInput)
      window.removeEventListener('keydown', onUserInput)
      pane?.removeEventListener('scroll', onScroll)
      pane?.removeEventListener('wheel', onUserInput)
      pane?.removeEventListener('touchstart', onUserInput)
      if (raf !== 0) cancelAnimationFrame(raf)
    }
  }, [entries, briefingSlug])

  function onJump(
    e: React.MouseEvent<HTMLAnchorElement>,
    entry: Entry,
  ) {
    if (typeof window === 'undefined') return
    const target = document.getElementById(entry.domId)
    if (!target) return
    e.preventDefault()
    setPinnedKey(entry.key)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `#${entry.domId}`)
    }
  }

  const displayedKey = pinnedKey ?? activeKey

  return (
    <ul className="flex list-none flex-col gap-0.5">
      {entries.map((e) => {
        const isActive = displayedKey === e.key
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
