import Link from 'next/link'
import { ArrowLeft, MapPin, Clock } from 'lucide-react'
import { briefingsLandingHref } from '@shared/briefings/routes'
import type { AwaitingBriefing } from '@shared/briefings/types'

type Props = {
  briefing: AwaitingBriefing
}

export default function BriefingAwaitingPage({
  briefing,
}: Props): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 px-4 pb-20 pt-6 lg:px-0">
        <div>
          <Link
            href={briefingsLandingHref()}
            className="inline-flex h-9 items-center gap-2 rounded-full pl-2 pr-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to meetings
          </Link>
        </div>

        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-foreground">
            {briefing.meetingName}
          </h1>

          <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Clock className="size-3.5 shrink-0" aria-hidden />
              {briefing.meetingDate}
              {briefing.meetingTime ? ` · ${briefing.meetingTime}` : ''}
            </p>
            {briefing.location ? (
              <p className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                {briefing.location}
              </p>
            ) : null}
          </div>

          <div className="rounded-lg border border-border bg-muted px-4 py-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Status:</span>{' '}
              Agenda not posted yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your briefing will be generated automatically once the agenda is
              published.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
