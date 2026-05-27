'use client'

import { useState } from 'react'
import { MessageSquare, Share2, Sparkles } from 'lucide-react'
import { Button } from '@styleguide'
import type { Briefing } from '@shared/briefings/types'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'
import ShareBriefingDrawer from './ShareBriefingDrawer'

type Props = {
  briefing: Briefing
}

/**
 * Sticky header actions on desktop. Share opens the bottom drawer whose
 * Copy/Email/Message/Download buttons all point at the public PDF URL
 * served by `gp-api` via the `/api/v1/briefings/:uuid` Vercel rewrite.
 * Notes and Briefing assistant open the annotation surfaces.
 */
export default function DetailHeaderActions({
  briefing,
}: Props): React.JSX.Element {
  const { openNotesSurface, openChatsSurface } = useAnnotationsCtx()
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Button variant="outline" onClick={() => setShareOpen(true)}>
        <Share2 className="size-4" aria-hidden />
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
      <ShareBriefingDrawer
        briefing={briefing}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </div>
  )
}
