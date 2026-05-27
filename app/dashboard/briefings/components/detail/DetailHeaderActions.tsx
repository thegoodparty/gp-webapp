'use client'

import { useState } from 'react'
import { Download, MessageSquare, Sparkles } from 'lucide-react'
import { Button, Loader2Icon } from '@styleguide'
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
 * Sticky header actions on desktop. Download builds the briefing PDF in
 * the browser via @react-pdf/renderer. "Add note" attaches a new note to
 * the currently-active card (disabled when no card is active). "Briefing
 * assistant" opens (or creates) a chat anchored to the active card's
 * title — the same shape a manual highlight-then-Ask-AI on the title
 * would produce.
 */
export default function DetailHeaderActions({
  briefing,
  preparedForLine,
  meetingMetaLine,
  liveBriefingUrl,
}: Props): React.JSX.Element {
  const { openAddNoteTopLevel, openCardLevelChat, activeCard } =
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
    } catch (err) {
      reportErrorToSentry(err, { experimentId: briefing.experiment_id })
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Button variant="outline" onClick={onDownload} disabled={downloading}>
        {downloading ? (
          <Loader2Icon className="size-4 animate-spin" aria-hidden />
        ) : (
          <Download className="size-4" aria-hidden />
        )}
        {downloading ? 'Preparing…' : 'Download'}
      </Button>
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
