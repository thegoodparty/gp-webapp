import { LoaderCircleIcon } from '@styleguide'
import type { BriefingSummary } from '@shared/briefings/types'

type PillVariant = {
  label: string
  className: string
  icon?: React.ReactNode
}

// Explicit switch keeps every userAgendaStatus enum value handled. The
// 'completed' case happens in the brief window between the agent finishing
// and the MeetingBriefing row landing locally — without the explicit branch
// the surface defaults to "Awaiting agenda" which is a misleading label.
// Shared by AwaitingAgendaRow (list) and UpcomingCountdownCard (landing) so
// both surfaces label an in-progress user agenda identically.
export const pillForAgendaStatus = (
  status: BriefingSummary['userAgendaStatus'],
): PillVariant => {
  switch (status) {
    case 'processing':
      return {
        label: 'Processing your agenda…',
        className: 'bg-primary/10 text-primary',
        icon: <LoaderCircleIcon className="size-3 animate-spin" aria-hidden />,
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
        icon: <LoaderCircleIcon className="size-3 animate-spin" aria-hidden />,
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

export default function AgendaStatusPill({
  status,
}: {
  status: BriefingSummary['userAgendaStatus']
}): React.JSX.Element {
  const pill = pillForAgendaStatus(status)
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${pill.className}`}
    >
      {pill.icon}
      {pill.label}
    </span>
  )
}
