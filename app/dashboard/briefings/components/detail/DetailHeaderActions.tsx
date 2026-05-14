'use client'

import { Download, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@styleguide'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'

/**
 * Sticky header actions on desktop. Download triggers a PDF download (TODO),
 * Add notes opens the AddNoteSheet with no anchor (top-level briefing note),
 * Ask AI opens the briefing assistant Sheet (TODO, phase 7).
 */
export default function DetailHeaderActions(): React.JSX.Element {
  const { openAddNoteTopLevel } = useAnnotationsCtx()
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Button
        variant="outline"
        onClick={() => {
          // TODO: trigger PDF download via Swain's briefing API.
        }}
      >
        <Download className="size-4" aria-hidden />
        Download
      </Button>
      <Button variant="outline" onClick={openAddNoteTopLevel}>
        <MessageSquare className="size-4" aria-hidden />
        Add notes
      </Button>
      <Button
        onClick={() => {
          // TODO (phase 7): open Ask AI sheet, no anchor preloaded.
        }}
      >
        <Sparkles className="size-4" aria-hidden />
        Ask AI
      </Button>
    </div>
  )
}
