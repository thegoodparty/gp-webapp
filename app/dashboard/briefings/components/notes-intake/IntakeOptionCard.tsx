'use client'

import type { LucideIcon } from 'lucide-react'

type Props = {
  icon: LucideIcon
  title: string
  description: string
  selected: boolean
  disabled?: boolean
  disabledHint?: string
  onClick: () => void
}

/**
 * One of the three option cards in the Add Notes dialog (camera / upload /
 * type). Clicking selects it; the parent dialog drives what selection means
 * (open native picker, show inline editor, etc.).
 */
export default function IntakeOptionCard({
  icon: Icon,
  title,
  description,
  selected,
  disabled,
  disabledHint,
  onClick,
}: Props): React.JSX.Element {
  const ringClass = selected
    ? 'border-primary ring-1 ring-primary'
    : 'border-border'
  const stateClass = disabled
    ? 'cursor-not-allowed opacity-60'
    : 'hover:bg-accent/40 cursor-pointer'

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={selected}
      title={disabled ? disabledHint : undefined}
      className={`flex w-full items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${ringClass} ${stateClass}`}
    >
      <span
        aria-hidden
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
      >
        <Icon className="size-5" />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-base font-semibold text-foreground">
          {title}
          {disabled ? (
            <span className="ml-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Coming soon
            </span>
          ) : null}
        </span>
        <span className="text-sm leading-5 text-muted-foreground">
          {description}
        </span>
      </span>
    </button>
  )
}
