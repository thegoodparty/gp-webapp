'use client'

import { Button, IconButton, MessageSquareIcon, XMarkIcon } from '@styleguide'
import type { ResolvedAnchor } from '@shared/briefings/anchorResolver'

type Props = {
  anchor: ResolvedAnchor | null
  onAddReview: () => void
}

/**
 * Floating pill anchored to the reviewer's text selection. Single action —
 * "Add review comment" — plus a dismiss button. Mirrors the candidate-facing
 * HighlightToolbar's positioning math but exposes only the review affordance.
 */
export default function ReviewHighlightToolbar({
  anchor,
  onAddReview,
}: Props): React.JSX.Element | null {
  if (!anchor) return null
  const rect = anchor.rect

  const toolbarApproxWidth = 220
  const margin = 8
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1280
  const rawLeft = rect.left + rect.width / 2 - toolbarApproxWidth / 2
  const left = Math.max(
    margin,
    Math.min(rawLeft, viewportW - toolbarApproxWidth - margin),
  )
  const top = Math.max(margin, rect.top - 48)

  function dismiss() {
    if (typeof window !== 'undefined') {
      window.getSelection()?.removeAllRanges()
    }
  }

  return (
    <div
      role="toolbar"
      aria-label="Review actions"
      className="fixed z-40 flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-md"
      style={{ top, left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Button type="button" size="small" onClick={onAddReview}>
        <MessageSquareIcon className="size-3.5" aria-hidden />
        Add review comment
      </Button>
      <IconButton
        type="button"
        size="small"
        variant="ghost"
        aria-label="Dismiss"
        onClick={dismiss}
      >
        <XMarkIcon className="size-4" aria-hidden />
      </IconButton>
    </div>
  )
}
