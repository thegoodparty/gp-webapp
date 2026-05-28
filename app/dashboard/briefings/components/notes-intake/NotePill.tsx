'use client'

import { Camera, FileText, Pencil, X, Loader2 } from 'lucide-react'

export type NotePillKind = 'typed' | 'image' | 'file'

type Props = {
  kind: NotePillKind
  text: string
  /**
   * When set, the pill renders a spinner instead of the X — used while a
   * staged pill is being committed or while server delete is in flight.
   */
  busy?: boolean
  onDelete: () => void
}

const ICON_FOR_KIND = {
  typed: Pencil,
  image: Camera,
  file: FileText,
} as const

/**
 * A pill summarising one top-level note. Same component is used for staged
 * (about-to-be-committed) and existing (already-saved) notes — the parent
 * dialog decides what `onDelete` should do in each case.
 */
export default function NotePill({
  kind,
  text,
  busy,
  onDelete,
}: Props): React.JSX.Element {
  const Icon = ICON_FOR_KIND[kind]
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-sm text-foreground">
      <Icon aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="min-w-0 truncate" title={text}>
        {text}
      </span>
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        aria-label="Remove note"
        className="ml-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? (
          <Loader2 className="size-3 animate-spin" aria-hidden />
        ) : (
          <X className="size-3" aria-hidden />
        )}
      </button>
    </span>
  )
}
