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
 * browser via @react-pdf/renderer; the "Add notes" and "Briefing assistant"
 * buttons open the cycler surfaces (notes / chats) so the user lands on
 * existing annotations first, with a new-item CTA inside the empty state.
 */
export default function DetailHeaderActions({
  briefing,
  preparedForLine,
  meetingMetaLine,
  liveBriefingUrl,
}: Props): React.JSX.Element {
  const { openNotesSurface, openChatsSurface } = useAnnotationsCtx()
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
