import { cn } from '@styleguide'

type AnchoredQuoteVariant = 'default' | 'destructive' | 'primary'

interface AnchoredQuoteProps {
  text: string
  variant?: AnchoredQuoteVariant
  showLabel?: boolean
  strike?: boolean
}

const VARIANT_BORDER: Record<AnchoredQuoteVariant, string> = {
  default: 'border-l-2 border-border',
  destructive: 'border-l border-destructive',
  primary: 'border-l-2 border-primary',
}

export function AnchoredQuote({
  text,
  variant = 'default',
  showLabel = true,
  strike = false,
}: AnchoredQuoteProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {showLabel ? (
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Anchored to
        </span>
      ) : null}
      <blockquote
        className={cn(
          VARIANT_BORDER[variant],
          'pl-3 text-sm italic leading-snug text-muted-foreground',
          strike && 'line-through',
        )}
      >
        “{text}”
      </blockquote>
    </div>
  )
}
