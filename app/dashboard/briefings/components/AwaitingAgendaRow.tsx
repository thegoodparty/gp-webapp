'use client'

import { useState } from 'react'
import { ChevronRight, MapPin } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@styleguide'
import {
  countdownLabel,
  formatDayTime,
  formatShortDate,
} from '@shared/briefings/dateHelpers'
import type { BriefingSummary } from '@shared/briefings/types'
import AgendaUploadBlock from './AgendaUploadBlock'

type Props = {
  summary: BriefingSummary
}

export default function AwaitingAgendaRow({
  summary,
}: Props): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const shortDate = formatShortDate(summary.scheduledAt)
  const dayTime = formatDayTime(summary.scheduledAt)
  const countdown = countdownLabel(summary.scheduledAt)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus:bg-muted/60 focus:outline-none"
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

          <span className="inline-flex items-center whitespace-nowrap rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Awaiting agenda
          </span>

          <ChevronRight
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mb-1">
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Upcoming{countdown ? ` · ${countdown}` : ''}
            </span>
          </div>
          <DialogTitle className="text-xl font-bold leading-7">
            {summary.meetingName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <p>
            {shortDate} · {dayTime}
          </p>
          {summary.location ? (
            <p className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {summary.location}
            </p>
          ) : null}
        </div>

        <AgendaUploadBlock
          meetingName={summary.meetingName}
          meetingSlug={summary.slug}
          onSubmitted={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
