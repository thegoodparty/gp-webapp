import type { Briefing } from '@shared/briefings/types'
import DetailHeaderActions from './DetailHeaderActions'

type Props = {
  briefing: Briefing
  preparedForLine?: string
  meetingMetaLine?: string
  liveBriefingUrl?: string
}

/**
 * Sticky top bar on the briefing detail page. Title + reading time on the
 * left; desktop-only Download and Ask AI buttons on the right.
 *
 * Mobile actions live in MobileFabs.
 */
export default function DetailHeader({
  briefing,
  preparedForLine,
  meetingMetaLine,
  liveBriefingUrl,
}: Props): React.JSX.Element {
  return (
    <div className="sticky top-0 z-20 border-b border-border bg-sidebar">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <div className="flex min-w-0 flex-col">
          <h1 className="text-base font-semibold text-foreground lg:truncate lg:text-lg">
            {briefing.title}
          </h1>
          <p className="whitespace-nowrap text-sm text-muted-foreground">
            {briefing.estimated_read_minutes} minute read
          </p>
        </div>
        <DetailHeaderActions
          briefing={briefing}
          preparedForLine={preparedForLine}
          meetingMetaLine={meetingMetaLine}
          liveBriefingUrl={liveBriefingUrl}
        />
      </div>
    </div>
  )
}
