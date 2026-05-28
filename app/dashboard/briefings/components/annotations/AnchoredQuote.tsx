import { cn } from '@styleguide'

type AnchoredQuoteVariant = 'default' | 'destructive' | 'primary'

interface AnchoredQuoteProps {
  text: string
  variant?: AnchoredQuoteVariant
  showLabel?: boolean
  strike?: boolean
  /**
   * When true, renders the quote inside a soft muted card with rounded
   * corners (border-left stays as the accent bar). Used for the notes
   * drawer where the quote sits as a discrete container, not a hanging
   * blockquote.
   */
  filled?: boolean
  /**
   * Override the default "Anchored to" caption with a section name
   * (rendered uppercase). Only used when `showLabel` is true.
   */
  label?: string
}

const VARIANT_BORDER: Record<AnchoredQuoteVariant, string> = {
  default: 'border-l-2 border-border',
  destructive: 'border-l-2 border-destructive',
  primary: 'border-l-2 border-primary',
}

export function AnchoredQuote({
  text,
  variant = 'default',
  showLabel = true,
  strike = false,
  filled = false,
  label,
}: AnchoredQuoteProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {showLabel ? (
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {label ?? 'Anchored to'}
        </span>
      ) : null}
      <blockquote
        className={cn(
          VARIANT_BORDER[variant],
          'text-sm italic leading-snug text-muted-foreground',
          filled ? 'rounded-md bg-muted/40 py-2.5 pl-3 pr-3' : 'pl-3',
          strike && 'line-through',
        )}
      >
        “{text}”
      </blockquote>
    </div>
  )
}
