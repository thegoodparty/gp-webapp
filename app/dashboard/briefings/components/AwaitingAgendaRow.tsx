'use client'

import { useState } from 'react'
import { ChevronRight, LoaderCircle } from 'lucide-react'
import { formatDayTime, formatShortDate } from '@shared/briefings/dateHelpers'
import type { BriefingSummary } from '@shared/briefings/types'
import UploadAgendaModal from './UploadAgendaModal'

type Props = {
  summary: BriefingSummary
}

type PillVariant = {
  label: string
  className: string
  icon?: React.ReactNode
}

// Explicit switch keeps every userAgendaStatus enum value handled. The
// 'completed' case happens in the brief window between the agent finishing
// and the MeetingBriefing row landing locally — without the explicit branch
// the row defaults to "Awaiting agenda" which is a misleading label.
const pillFor = (status: BriefingSummary['userAgendaStatus']): PillVariant => {
  switch (status) {
    case 'processing':
      return {
        label: 'Processing your agenda…',
        className: 'bg-primary/10 text-primary',
        icon: <LoaderCircle className="size-3 animate-spin" aria-hidden />,
      }
    case 'failed':
      return {
        label: 'Briefing failed',
        className: 'bg-destructive/10 text-destructive',
      }
    case 'completed':
      // Race window: agent finished, briefing row not yet upserted into
      // local DB. Render a brief "Finishing up" pill instead of bouncing
      // back to "Awaiting agenda."
      return {
        label: 'Finishing up…',
        className: 'bg-primary/10 text-primary',
        icon: <LoaderCircle className="size-3 animate-spin" aria-hidden />,
      }
    case 'unknown':
    case null:
    case undefined:
      return {
        label: 'Awaiting agenda',
        className: 'bg-muted text-muted-foreground',
      }
  }
}

export default function AwaitingAgendaRow({
  summary,
}: Props): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const shortDate = formatShortDate(summary.scheduledAt)
  const dayTime = formatDayTime(summary.scheduledAt)

  const status = summary.userAgendaStatus
  const isProcessing = status === 'processing'
  const pill = pillFor(status)

  // While the user's agenda is processing, don't let them re-open the
  // modal — they've already submitted. `failed` and `null`/awaiting both
  // open the modal (failed allows a retry).
  const rowDisabled = isProcessing

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!rowDisabled) setOpen(true)
        }}
        aria-disabled={rowDisabled || undefined}
        className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus:bg-muted/60 focus:outline-none aria-disabled:cursor-default aria-disabled:hover:bg-transparent"
      >
        <span
          aria-hidden
          className="inline-block size-2.5 shrink-0 rounded-full border-2 border-current text-muted-foreground/60"
        />

        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          <span className="inline-block w-16 md:hidden">{shortDate}</span>
          <span className="hidden w-52 md:inline-block">
            {shortDate} · {dayTime}
          </span>
        </span>

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {summary.meetingName}
        </span>

        <span
          className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${pill.className}`}
        >
          {pill.icon}
          {pill.label}
        </span>

        <ChevronRight
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground"
        />
      </button>

      <UploadAgendaModal
        open={open}
        onOpenChange={setOpen}
        meetingDate={summary.slug}
        meetingName={summary.meetingName}
      />
    </>
  )
}
