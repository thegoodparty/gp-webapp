'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, ChevronUp, Download, Sparkles } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@styleguide'
import {
  briefingItemHref,
  briefingOverviewHref,
} from '@shared/briefings/routes'
import type { AgendaItem } from '@shared/briefings/types'

type Props = {
  briefingSlug: string
  agenda: AgendaItem[]
}

/**
 * Mobile-only bottom dock visible below the lg breakpoint:
 *
 *  - Left pill: name of the current page (Executive Summary or agenda item)
 *    + chevron, opens a bottom Sheet for navigation.
 *  - Right FABs: Download and Ask AI.
 *
 * Selecting an entry navigates to that page; the Sheet closes on tap.
 */
export default function MobileBottomBar({
  briefingSlug,
  agenda,
}: Props): React.JSX.Element {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const overviewHref = briefingOverviewHref(briefingSlug)

  const currentLabel = useMemo(() => {
    if (pathname === overviewHref) return 'Executive Summary'
    const match = agenda.find(
      (a) => pathname === briefingItemHref(briefingSlug, a.id),
    )
    return match?.title ?? 'Executive Summary'
  }, [agenda, briefingSlug, overviewHref, pathname])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-end justify-between gap-2 px-4 pb-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto inline-flex max-w-[70%] items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-left text-sm font-medium text-foreground shadow-md hover:bg-muted/60"
        >
          <List className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="truncate">{currentLabel}</span>
          <ChevronUp
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
        </button>
        <SheetContent
          side="bottom"
          className="max-h-[70vh] rounded-t-2xl px-4 pb-6 pt-4"
        >
          <SheetHeader className="px-0">
            <SheetTitle>Jump to section</SheetTitle>
          </SheetHeader>
          <ul className="mt-3 flex list-none flex-col gap-0.5 overflow-y-auto">
            <li>
              <Link
                href={overviewHref}
                onClick={() => setOpen(false)}
                className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm leading-5 ${
                  pathname === overviewHref
                    ? 'bg-muted font-semibold text-foreground'
                    : 'text-foreground hover:bg-muted/60'
                }`}
              >
                Executive Summary
              </Link>
            </li>
            {agenda.map((a) => {
              const href = briefingItemHref(briefingSlug, a.id)
              const isActive = pathname === href
              return (
                <li key={a.id}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm leading-5 ${
                      isActive
                        ? 'bg-muted font-semibold text-foreground'
                        : 'text-foreground hover:bg-muted/60'
                    }`}
                  >
                    {a.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </SheetContent>
      </Sheet>

      <div className="pointer-events-auto flex flex-col gap-2">
        <button
          type="button"
          aria-label="Download PDF"
          onClick={() => {
            // TODO: trigger PDF download via Swain's briefing API.
          }}
          className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md hover:bg-muted/60"
        >
          <Download className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Open briefing assistant"
          onClick={() => {
            // TODO (phase 7): open Ask AI sheet.
          }}
          className="inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
        >
          <Sparkles className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  )
}
