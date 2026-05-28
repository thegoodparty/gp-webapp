'use client'

import { MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@styleguide'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'

/**
 * Sticky bottom-right footer on desktop. Hosts "Add note" + "Briefing
 * assistant" — the same active-card-gated actions that drive
 * `MobileBottomBar` on small screens. Lovable's design keeps them in the
 * bottom bar on desktop too, so the header stays clean (Share only).
 *
 * Both buttons require an active card; the scrollspy in `<ActiveCardScrollSpy>`
 * keeps that state in sync as the user scrolls.
 */
export default function DesktopBottomBar(): React.JSX.Element {
  const { openAddNoteTopLevel, openCardLevelChat, activeCard } =
    useAnnotationsCtx()

  return (
    <div className="fixed bottom-0 right-0 left-0 z-[5] hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:left-[var(--sidebar-width,16rem)] lg:block">
      {/* Match the briefing content frame: max-w-[1120px] centered with
          px-8 so the buttons hug the content's right edge instead of the
          viewport's right edge. */}
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-end gap-2 px-8 py-3">
        <Button
          variant="outline"
          onClick={openAddNoteTopLevel}
          disabled={!activeCard}
          title={
            activeCard
              ? `Add a note to ${activeCard.title}`
              : 'Click a card to make it active first'
          }
          className="text-sm!"
        >
          <MessageSquare className="size-4" aria-hidden />
          Notes
        </Button>
        <Button
          onClick={openCardLevelChat}
          disabled={!activeCard}
          title={
            activeCard
              ? `Ask AI about ${activeCard.title}`
              : 'Click a card to make it active first'
          }
          className="text-sm!"
        >
          <Sparkles className="size-4" aria-hidden />
          Ask AI
        </Button>
      </div>
    </div>
  )
}
