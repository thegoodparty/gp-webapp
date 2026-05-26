import ReadAloudButton from './ReadAloudButton'

type Props = {
  summary: string
  domId: string
  /**
   * Pre-rendered plain-text version of the briefing for the speech
   * service. Built by the page via `renderBriefingForSpeech` and
   * threaded down so the read-aloud control stays a thin UI shell.
   */
  speechText: string
  /** Optional label forwarded to analytics so usage can be sliced by surface. */
  analyticsLabel?: string
}

/**
 * First card on the briefing detail page. Title plus a one-liner that
 * frames what's coming, with a Read aloud control that synthesizes the
 * pre-rendered briefing text via the speech service.
 */
export default function ExecutiveSummaryCard({
  summary,
  domId,
  speechText,
  analyticsLabel,
}: Props): React.JSX.Element {
  return (
    <article
      id={domId}
      className="flex scroll-mt-[104px] flex-col gap-2 rounded-2xl border border-border bg-card p-6 lg:scroll-mt-3"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-2xl font-semibold text-foreground">
          Executive Summary
        </h2>
        <ReadAloudButton text={speechText} analyticsLabel={analyticsLabel} />
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
