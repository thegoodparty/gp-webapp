'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button, Loader2Icon } from '@styleguide'
import { downloadBriefingPdf } from '@shared/briefings/pdf/downloadBriefingPdf'
import { reportErrorToSentry } from '@shared/sentry'
import type { Briefing } from '@shared/briefings/types'

type Props = {
  briefing: Briefing
  preparedForLine?: string
  meetingMetaLine?: string
  liveBriefingUrl?: string
}

/**
 * Sticky header actions on desktop. Download builds the briefing PDF in the
 * browser via @react-pdf/renderer. Notes + Ask AI live in the sticky
 * bottom-right footer (DesktopBottomBar) instead.
 */
export default function DetailHeaderActions({
  briefing,
  preparedForLine,
  meetingMetaLine,
  liveBriefingUrl,
}: Props): React.JSX.Element {
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
    </div>
  )
}
