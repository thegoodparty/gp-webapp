'use client'

import { Download, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@styleguide'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'
import AskAiPopover from '../annotations/AskAiPopover'

/**
 * Sticky header actions on desktop. Download triggers a PDF download (TODO),
 * Add notes opens the AddNoteSheet with no anchor (top-level briefing note),
 * Ask AI opens the briefing assistant popover with no anchor (top-level).
 */
export default function DetailHeaderActions(): React.JSX.Element {
  const { meetingDate, openAddNoteTopLevel, onChatCreated } =
    useAnnotationsCtx()
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
      <AskAiPopover
        meetingDate={meetingDate}
        anchor={null}
        align="end"
        side="bottom"
        onChatCreated={onChatCreated}
        trigger={
          <Button>
            <Sparkles className="size-4" aria-hidden />
            Ask AI
          </Button>
        }
      />
    </div>
  )
}
