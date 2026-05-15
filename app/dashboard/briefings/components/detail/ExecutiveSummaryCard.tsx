import ReadAloudButton from './ReadAloudButton'

type Props = {
  summary: string
  domId: string
  /**
   * Meeting date in YYYY-MM-DD form, threaded down to the Read aloud
   * button so it can target the right briefing artifact.
   */
  meetingDate: string
}

/**
 * First card on the briefing detail page. Title plus a one-liner that
 * frames what's coming, with a Read aloud control that synthesizes the
 * briefing via the speech service.
 */
export default function ExecutiveSummaryCard({
  summary,
  domId,
  meetingDate,
}: Props): React.JSX.Element {
  return (
    <article
      id={domId}
      className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-2xl font-semibold text-foreground">
          Executive Summary
        </h2>
        <ReadAloudButton meetingDate={meetingDate} />
      </div>
      <p
        className="text-sm text-muted-foreground"
        data-briefing-json-path="/executiveSummary"
      >
        {summary}
      </p>
    </article>
  )
}
