import ReadAloudButton from './ReadAloudButton'

type Props = {
  summary: string
  domId: string
}

/**
 * First card on the briefing detail page. Title plus a one-liner that
 * frames what's coming. The Read aloud button toggles state but is a
 * stub until Nikao's TTS lands.
 */
export default function ExecutiveSummaryCard({
  summary,
  domId,
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
        <ReadAloudButton />
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
