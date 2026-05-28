'use client'

import { MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@styleguide'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'

/**
 * Sticky bottom-right footer on desktop. Hosts the floating "Notes" and
 * "Ask AI" pill buttons that open the annotation cycler surfaces. Hidden
 * on mobile — MobileBottomBar covers the small-screen layout.
 */
export default function DesktopBottomBar(): React.JSX.Element {
  const { openNotesSurface, openChatsSurface } = useAnnotationsCtx()

  return (
    <div className="fixed bottom-0 right-0 left-0 z-[5] hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:left-[var(--sidebar-width,16rem)] lg:block">
      {/* Match the briefing content frame: max-w-[1120px] centered with
          px-8 so the buttons hug the content's right edge instead of the
          viewport's right edge. */}
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-end gap-2 px-8 py-3">
        <Button variant="outline" onClick={() => openNotesSurface()}>
          <MessageSquare className="size-4" aria-hidden />
          Notes
        </Button>
        <Button onClick={() => openChatsSurface()}>
          <Sparkles className="size-4" aria-hidden />
          Ask AI
        </Button>
      </div>
    </div>
  )
}
