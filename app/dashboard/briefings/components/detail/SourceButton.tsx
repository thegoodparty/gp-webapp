import type { Source } from '@shared/briefings/types'

type Props = {
  source: Source
}

/**
 * Inline source citation rendered next to a stat or paragraph.
 *
 *   source: [G Good Party internal data]
 *
 * Letter-tile avatar + label. Clicking is a no-op for now; later phases
 * may open a popover with the underlying source details.
 */
export default function SourceButton({ source }: Props): React.JSX.Element {
  return (
    <button
      type="button"
      aria-label={`1 source: ${source.label}`}
      className="inline-flex max-w-full translate-y-[1px] items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 align-middle text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <span
        aria-hidden
        className="inline-flex items-center justify-center rounded-sm bg-primary/15 text-[10px] font-bold text-primary"
        style={{ width: 12, height: 12 }}
      >
        {source.iconInitial}
      </span>
      <span className="truncate">{source.label}</span>
    </button>
  )
}
