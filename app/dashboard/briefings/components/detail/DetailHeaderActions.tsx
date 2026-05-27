'use client'

import { MessageSquare, Sparkles } from 'lucide-react'
import { Button, Share2Icon } from '@styleguide'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'
import { useShareScope } from './ShareScope'

/**
 * Sticky header actions on desktop. Share opens the bottom drawer whose
 * Copy/Email/Message/Download buttons all point at the public PDF URL
 * served by `gp-api` via the `/api/v1/briefings/:uuid` Vercel rewrite —
 * the client-side react-pdf Download flow this surface used to host was
 * removed alongside that backend cutover.
 *
 * "Add note" attaches a new note to the currently-active card (disabled
 * when no card is active). "Briefing assistant" opens (or creates) a
 * chat anchored to the active card's title — the same shape a manual
 * highlight-then-Ask-AI on the title would produce.
 *
 * The actual `<ShareBriefingDrawer>` lives in `<ShareScope>` at the
 * layout level — this component just dispatches the open call. That
 * keeps a single Radix Sheet instance on the page so focus / portal
 * management doesn't race with the mirror in `MobileBottomBar`.
 */
export default function DetailHeaderActions(): React.JSX.Element {
  const { openAddNoteTopLevel, openCardLevelChat, activeCard } =
    useAnnotationsCtx()
  const { canShare, openShareDrawer } = useShareScope()

  return (
    <div className="hidden items-center gap-2 lg:flex">
      {canShare && (
        <Button variant="outline" onClick={openShareDrawer}>
          <Share2Icon className="size-4" aria-hidden />
          Share
        </Button>
      )}
      <Button
        variant="outline"
        onClick={openAddNoteTopLevel}
        disabled={!activeCard}
        title={
          activeCard
            ? `Add a note to ${activeCard.title}`
            : 'Click a card to make it active first'
        }
      >
        <MessageSquare className="size-4" aria-hidden />
        Add note
      </Button>
      <Button
        onClick={openCardLevelChat}
        disabled={!activeCard}
        title={
          activeCard
            ? `Ask AI about ${activeCard.title}`
            : 'Click a card to make it active first'
        }
      >
        <Sparkles className="size-4" aria-hidden />
        Briefing assistant
      </Button>
    </div>
  )
}
