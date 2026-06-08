'use client'

import { useState } from 'react'
import { ChevronRightIcon } from '@styleguide'
import { formatDayTime, formatShortDate } from '@shared/briefings/dateHelpers'
import type { BriefingSummary } from '@shared/briefings/types'
import AgendaStatusPill from './AgendaStatusPill'
import UploadAgendaModal from './UploadAgendaModal'

type Props = {
  summary: BriefingSummary
}

export default function AwaitingAgendaRow({
  summary,
}: Props): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const shortDate = formatShortDate(summary.scheduledAt)
  const dayTime = formatDayTime(summary.scheduledAt)
  // Off-list upload rows (a user-supplied agenda for a date the schedule no
  // longer projects) carry no meeting name; fall back so the row and modal
  // title are never blank.
  const meetingName = summary.meetingName || 'Your meeting'

  const status = summary.userAgendaStatus
  const isProcessing = status === 'processing'

  // Block re-opening the modal only while the user's agenda is actively
  // processing. The `completed` state used to lock the row too — to defend
  // against a double-submit during the brief window between the agent
  // finishing and the briefing row appearing — but if the briefing row
  // never persists (e.g., S3/publish failure) the row would stay disabled
  // with a spinner forever, blocking retry. Trade-off accepted: the worst
  // case of a double-submit in that race window is one redundant agent
  // run; the worst case of staying disabled forever is a stuck user with
  // no escape. The row only renders in the awaiting-agenda surface, so a
  // genuinely-completed briefing replaces this row within seconds anyway.
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
          {meetingName}
        </span>

        <AgendaStatusPill status={status} />

        <ChevronRightIcon
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground"
        />
      </button>

      <UploadAgendaModal
        open={open}
        onOpenChange={setOpen}
        meetingDate={summary.slug}
        meetingName={meetingName}
      />
    </>
  )
}
