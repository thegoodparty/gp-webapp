'use client'

import { Sparkles, MessageSquare, Bug, X } from 'lucide-react'
import type { ResolvedAnchor } from '@shared/briefings/anchorResolver'

type Props = {
  anchor: ResolvedAnchor | null
  onAddNote: () => void
  onReportError: () => void
}

/**
 * Floating pill that appears anchored to the user's text selection.
 *
 * Four buttons:
 *   - Ask AI    (no-op stub, wired in phase 7)
 *   - Add Note  (opens the AddNoteSheet with the resolved anchor)
 *   - Bug icon  (no-op stub, wired in phase 6)
 *   - X dismiss (clears selection)
 *
 * Positioned via fixed coordinates derived from the selection rect. Hidden
 * when no selection is active.
 */
export default function HighlightToolbar({
  anchor,
  onAddNote,
  onReportError,
}: Props): React.JSX.Element | null {
  if (!anchor) return null
  const rect = anchor.rect

  // Center horizontally over the selection, sit ~44px above its top edge.
  // Clamp to viewport with a small margin.
  const toolbarApproxWidth = 240
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
      aria-label="Selection actions"
      className="fixed z-40 flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-md"
      style={{ top, left }}
      // Don't let mousedown on the toolbar collapse the selection.
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        type="button"
        onClick={() => {
          // TODO (phase 7): open Ask AI sheet with the anchor's quote preloaded.
        }}
        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Sparkles className="size-3.5" aria-hidden />
        Ask AI
      </button>
      <button
        type="button"
        onClick={onAddNote}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted/60"
      >
        <MessageSquare className="size-3.5" aria-hidden />
        Add Note
      </button>
      <button
        type="button"
        aria-label="Report or correct an error"
        onClick={onReportError}
        className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60"
      >
        <Bug className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismiss}
        className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  )
}
