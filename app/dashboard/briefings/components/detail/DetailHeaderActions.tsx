'use client'

import { useState } from 'react'
import { Download, Loader2, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@styleguide'
import { downloadBriefingPdf } from '@shared/briefings/pdf/downloadBriefingPdf'
import { reportErrorToSentry } from '@shared/sentry'
import type { Briefing } from '@shared/briefings/types'
import { useAnnotationsCtx } from '../annotations/AnnotationsScope'

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
 * in the right-side AskAiSheet (same surface used for anchored and
 * existing-chat overlays).
 */
export default function DetailHeaderActions({
  briefing,
  preparedForLine,
  meetingMetaLine,
  liveBriefingUrl,
}: Props): React.JSX.Element {
  const { openAddNoteTopLevel, openAskAiTopLevel } = useAnnotationsCtx()
  const [downloading, setDownloading] = useState(false)

  const onDownload = async () => {
    setDownloading(true)
    try {
      await downloadBriefingPdf(briefing, {
        preparedForLine,
        meetingMetaLine,
        liveBriefingUrl,
      })
    } catch (err) {
      reportErrorToSentry(err, { experimentId: briefing.experimentId })
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
        <MessageSquare className="size-4" aria-hidden />
        Add notes
      </Button>
      <Button onClick={openAskAiTopLevel}>
        <Sparkles className="size-4" aria-hidden />
        Ask AI
      </Button>
    </div>
  )
}
