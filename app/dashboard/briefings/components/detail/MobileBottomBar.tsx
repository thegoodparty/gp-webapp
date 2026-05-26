'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  List,
  ChevronUp,
  Download,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import {
  Button,
  IconButton,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@styleguide'
import {
  BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
  briefingItemDomId,
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
}

/**
 * Mobile-only bottom dock visible below the lg breakpoint:
 *
 *  - Left pill: name of the section currently in view + chevron, opens a
 *    bottom Sheet listing every section.
 *  - Right FABs: Download, Add notes, and Ask AI.
 *
 * Tapping an entry scrolls to that section on the same page; the Sheet
 * closes on tap.
 */
export default function MobileBottomBar({
  briefingSlug,
  items,
}: Props): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const { openAddNoteTopLevel, openAskAiTopLevel } = useAnnotationsCtx()

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
        // Mirror DetailToc's scroll-spy: pick the section whose top is
        // closest to (but above) the sticky-header offset line.
        if (top - 104 <= 1 && top > bestTop) {
          bestTop = top
          bestKey = e.key
        }
      }
      setActiveKey(bestKey)
    }

    function onScroll() {
      if (raf === 0) raf = requestAnimationFrame(pickActive)
    }

    // Listen on both window (mobile document scroll) and the briefing
    // content pane (desktop, where the right column scrolls). Element
    // scroll events don't bubble, so we attach directly to the pane.
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

  const currentLabel =
    entries.find((e) => e.key === activeKey)?.label ?? 'Executive Summary'

  function onJump(
    ev: React.MouseEvent<HTMLAnchorElement>,
    domId: string,
  ): void {
    if (typeof window === 'undefined') return
    const target = document.getElementById(domId)
    if (!target) return
    ev.preventDefault()
    setOpen(false)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `#${domId}`)
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80 lg:hidden">
      <div className="mx-auto flex w-full max-w-[800px] items-center gap-2 px-4 py-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(true)}
            className="min-w-0 flex-1 justify-between"
          >
            <List className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="truncate">{currentLabel}</span>
            <ChevronUp
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
          </Button>
          <SheetContent
            side="bottom"
            className="max-h-[70vh] rounded-t-2xl px-4 pb-6 pt-4"
          >
            <SheetHeader className="px-0">
              <SheetTitle>Jump to section</SheetTitle>
            </SheetHeader>
            <ul className="mt-3 flex list-none flex-col gap-0.5 overflow-y-auto">
              {entries.map((e) => {
                const isActive = activeKey === e.key
                return (
                  <li key={e.key}>
                    <a
                      href={`#${e.domId}`}
                      onClick={(ev) => onJump(ev, e.domId)}
                      className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm leading-5 ${
                        isActive
                          ? 'bg-muted font-semibold text-foreground'
                          : 'text-foreground hover:bg-muted/60'
                      }`}
                    >
                      {e.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </SheetContent>
        </Sheet>

        <IconButton
          type="button"
          size="medium"
          variant="outline"
          aria-label="Download PDF"
          onClick={() => {
            // TODO: trigger PDF download via Swain's briefing API.
          }}
        >
          <Download className="size-5" aria-hidden />
        </IconButton>
        <IconButton
          type="button"
          size="medium"
          variant="outline"
          aria-label="Add notes"
          onClick={openAddNoteTopLevel}
        >
          <MessageSquare className="size-5" aria-hidden />
        </IconButton>
        <IconButton
          type="button"
          size="medium"
          aria-label="Open briefing assistant"
          onClick={openAskAiTopLevel}
        >
          <Sparkles className="size-5" aria-hidden />
        </IconButton>
      </div>
    </div>
  )
}
