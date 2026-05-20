'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, ChevronUp, Download, NotebookPen, Sparkles } from 'lucide-react'
import {
  Button,
  IconButton,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@styleguide'
import {
  briefingItemHref,
  briefingOverviewHref,
} from '@shared/briefings/routes'
import type { Item } from '@shared/briefings/types'
import AskAiPopover from '../annotations/AskAiPopover'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'

type Props = {
  briefingSlug: string
  items: Item[]
}

/**
 * Mobile-only bottom dock visible below the lg breakpoint:
 *
 *  - Left pill: name of the current page (Executive Summary or agenda item)
 *    + chevron, opens a bottom Sheet for navigation.
 *  - Right FABs: Download, Add notes, and Ask AI.
 *
 * Selecting an entry navigates to that page; the Sheet closes on tap.
 */
export default function MobileBottomBar({
  briefingSlug,
  items,
}: Props): React.JSX.Element {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const {
    meetingDate,
    openAddNoteTopLevel,
    onChatCreated,
    topLevelChatAnnotationId,
  } = useAnnotationsCtx()

  const overviewHref = briefingOverviewHref(briefingSlug)

  const currentLabel = useMemo(() => {
    if (pathname === overviewHref) return 'Executive Summary'
    const match = items.find(
      (a) => pathname === briefingItemHref(briefingSlug, a.id),
    )
    return match?.title ?? 'Executive Summary'
  }, [items, briefingSlug, overviewHref, pathname])

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
              {items.map((a) => {
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
          <NotebookPen className="size-5" aria-hidden />
        </IconButton>
        <AskAiPopover
          meetingDate={meetingDate}
          anchor={null}
          align="end"
          side="top"
          existingAnnotationId={topLevelChatAnnotationId}
          onChatCreated={onChatCreated}
          trigger={
            <IconButton
              type="button"
              size="medium"
              aria-label="Open briefing assistant"
            >
              <Sparkles className="size-5" aria-hidden />
            </IconButton>
          }
        />
      </div>
    </div>
  )
}
