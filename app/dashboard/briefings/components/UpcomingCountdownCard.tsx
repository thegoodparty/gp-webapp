'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { Button, buttonVariants, UploadIcon } from '@styleguide'
import { countdownLabel } from '@shared/briefings/dateHelpers'
import type { BriefingSummary } from '@shared/briefings/types'
import AgendaStatusPill from './AgendaStatusPill'
import UploadAgendaModal from './UploadAgendaModal'

type Props = {
  summary: BriefingSummary
}

/**
 * The featured callout at the top of the briefings landing page.
 *
 * Shown for the nearest upcoming briefing. Bordered card with a blue
 * UPCOMING countdown pill, meeting metadata, and a single CTA: "View briefing"
 * once ready, otherwise an "Upload agenda" path. The upload affordance lives
 * here as well as in AwaitingAgendaRow because the featured meeting is
 * excluded from the Upcoming list — without it, the nearest awaiting meeting
 * would have no submission path on the landing page.
 */
export default function UpcomingCountdownCard({
  summary,
}: Props): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const label = countdownLabel(summary.scheduledAt)
  const ready = summary.status === 'briefing_ready'
  const status = summary.userAgendaStatus
  const isProcessing = status === 'processing'
  // Mirror AwaitingAgendaRow: allow (re)submitting unless a run is actively
  // processing. 'completed'/'finishing up' stays openable so a briefing row
  // that never persists doesn't trap the user without a retry.
  const canUpload = !isProcessing
  const meetingName = summary.meetingName || 'Your meeting'

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-card p-6 shadow-sm">
      {label ? (
        <div>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            Upcoming · {label}
          </span>
        </div>
      ) : null}

      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold leading-7 text-foreground">
          {summary.meetingName}
        </h2>
        <p className="text-sm text-muted-foreground">{summary.meetingDate}</p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" aria-hidden />
          {summary.location}
        </p>
      </div>

      {ready ? (
        <div className="pt-1">
          <Link
            href={`/dashboard/briefings/${summary.slug}`}
            className={buttonVariants()}
          >
            View briefing
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 pt-1">
          <AgendaStatusPill status={status} />
          {canUpload ? (
            <Button type="button" onClick={() => setOpen(true)}>
              <UploadIcon className="size-4" aria-hidden />
              Upload agenda
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              We&apos;re building your briefing — check back shortly.
            </p>
          )}
        </div>
      )}

      <UploadAgendaModal
        open={open}
        onOpenChange={setOpen}
        meetingDate={summary.slug}
        meetingName={meetingName}
      />
    </section>
  )
}
