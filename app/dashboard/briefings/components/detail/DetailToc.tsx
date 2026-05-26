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

// Distance below the top of the viewport where we draw the "current section"
// line. Matches the sticky header height + the `scroll-mt-[104px]` applied to
// each card root, so scroll target alignment and active-state detection use
// the same offset.
const HEADER_OFFSET = 104

/**
 * Sidebar TOC. All agenda items render inline on the briefing detail
 * page, so the TOC scrolls within the page rather than navigating.
 *
 * Active state is a rAF-throttled scroll-spy: on every scroll frame we
 * pick the section whose top sits closest to (but above) HEADER_OFFSET.
 * One section is "active" per frame, so the highlight never flickers
 * during smooth scrolls.
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

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (entries.length === 0) return

    let raf = 0

    function pickActive() {
      raf = 0
      let bestKey = entries[0]?.key ?? ''
      let bestTop = -Infinity
      for (const e of entries) {
        const el = document.getElementById(e.domId)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        // Sections at or above the offset line are candidates. The one
        // closest to the line (largest top that's still <= offset) wins.
        if (top - HEADER_OFFSET <= 1 && top > bestTop) {
          bestTop = top
          bestKey = e.key
        }
      }
      setActiveKey(bestKey)
    }

    function onScroll() {
      if (raf === 0) raf = requestAnimationFrame(pickActive)
    }

    // Listen on both window (mobile, where the document scrolls) and the
    // briefing content pane (desktop, where the right column scrolls
    // independently). Element scroll events don't bubble, so we have to
    // attach directly to the pane.
    const pane = document.getElementById('briefing-detail-pane')
    pickActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    pane?.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      pane?.removeEventListener('scroll', onScroll)
      if (raf !== 0) cancelAnimationFrame(raf)
    }
  }, [entries, briefingSlug])

  function onJump(e: React.MouseEvent<HTMLAnchorElement>, domId: string) {
    if (typeof window === 'undefined') return
    const target = document.getElementById(domId)
    if (!target) return
    e.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `#${domId}`)
    }
  }

  return (
    <ul className="flex list-none flex-col gap-0.5">
      {entries.map((e) => {
        const isActive = activeKey === e.key
        return (
          <li key={e.key}>
            <a
              href={`#${e.domId}`}
              onClick={(ev) => onJump(ev, e.domId)}
              className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm leading-5 transition-colors ${
                isActive
                  ? 'bg-muted font-semibold text-foreground'
                  : 'text-foreground hover:bg-muted/60'
              }`}
            >
              <span className="min-w-0">{e.label}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
