'use client'

import { MessageSquare, Sparkles } from 'lucide-react'
import { Button, Share2Icon } from '@styleguide'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'
import { useShareScope } from './ShareScope'

/**
 * Sticky header actions on desktop. Share opens the bottom drawer whose
 * Copy/Email/Message/Download buttons all point at the public PDF URL
 * served by `gp-api` via the `/api/v1/briefings/:uuid` Vercel rewrite.
 * Notes and Briefing assistant open the annotation surfaces.
 *
 * The actual `<ShareBriefingDrawer>` lives in `<ShareScope>` at the layout
 * level — this component just dispatches the open call. That keeps a
 * single Radix Sheet instance on the page so focus / portal management
 * doesn't race with the mirror in `MobileBottomBar`.
 */
export default function DetailHeaderActions(): React.JSX.Element {
  const { openNotesSurface, openChatsSurface } = useAnnotationsCtx()
  const { openShareDrawer } = useShareScope()

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Button variant="outline" onClick={openShareDrawer}>
        <Share2Icon className="size-4" aria-hidden />
        Share
      </Button>
      <Button variant="outline" onClick={() => openNotesSurface()}>
        <MessageSquare className="size-4" aria-hidden />
        Notes
      </Button>
      <Button onClick={() => openChatsSurface()}>
        <Sparkles className="size-4" aria-hidden />
        Briefing assistant
      </Button>
    </div>
  )
}
