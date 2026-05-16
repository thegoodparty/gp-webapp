'use client'

import { useState } from 'react'
import { Download, Loader2, NotebookPen, Sparkles } from 'lucide-react'
import { Button } from '@styleguide'
import { downloadBriefingPdf } from '@shared/briefings/pdf/downloadBriefingPdf'
import type { Briefing } from '@shared/briefings/types'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'
import AskAiPopover from '../annotations/AskAiPopover'

type Props = {
  briefing: Briefing
  preparedForLine?: string
  meetingMetaLine?: string
  liveBriefingUrl?: string
}

/**
 * Sticky header actions on desktop. Download builds the briefing PDF in the
 * browser via @react-pdf/renderer, Add notes opens the AddNoteSheet with
 * no anchor (top-level briefing note), Ask AI opens the briefing assistant
 * Sheet (TODO, phase 7).
 */
export default function DetailHeaderActions({
  briefing,
  preparedForLine,
  meetingMetaLine,
  liveBriefingUrl,
}: Props): React.JSX.Element {
  const { meetingDate, openAddNoteTopLevel, onChatCreated } =
    useAnnotationsCtx()
  const [downloading, setDownloading] = useState(false)

  const onDownload = async () => {
    setDownloading(true)
    try {
      await downloadBriefingPdf(briefing, {
        preparedForLine,
        meetingMetaLine,
        liveBriefingUrl,
      })
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Button variant="outline" onClick={onDownload} disabled={downloading}>
        {downloading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Download className="size-4" aria-hidden />
        )}
        {downloading ? 'Preparing…' : 'Download'}
      </Button>
      <Button variant="outline" onClick={openAddNoteTopLevel}>
        <NotebookPen className="size-4" aria-hidden />
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
