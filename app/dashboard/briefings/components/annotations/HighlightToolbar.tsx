'use client'

import { Sparkles, MessageSquare, Bug, X } from 'lucide-react'
import { Button, IconButton } from '@styleguide'
import type { ResolvedAnchor } from '@shared/briefings/anchorResolver'

type Props = {
  anchor: ResolvedAnchor | null
  onAddNote: () => void
  onReportError: () => void
  onAskAi: () => void
}

/**
 * Floating pill that appears anchored to the user's text selection.
 *
 * Four buttons:
 *   - Ask AI    (opens the AskAiPopover anchored to the selection)
 *   - Add Note  (opens the AddNoteSheet with the resolved anchor)
 *   - Report    (opens the ReportErrorSheet with the resolved anchor)
 *   - X dismiss (clears selection)
 *
 * Positioned via fixed coordinates derived from the selection rect. Hidden
 * when no selection is active.
 */
export default function HighlightToolbar({
  anchor,
  onAddNote,
  onReportError,
  onAskAi,
}: Props): React.JSX.Element | null {
  if (!anchor) return null
  const rect = anchor.rect

  // Center horizontally over the selection, sit ~44px above its top edge.
  // Clamp to viewport with a small margin.
  const toolbarApproxWidth = 300
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
      <Button type="button" size="small" onClick={onAskAi}>
        <Sparkles className="size-3.5" aria-hidden />
        Ask AI
      </Button>
      <Button type="button" size="small" variant="outline" onClick={onAddNote}>
        <MessageSquare className="size-3.5" aria-hidden />
        Add Note
      </Button>
      <Button
        type="button"
        size="small"
        variant="outline"
        onClick={onReportError}
      >
        <Bug className="size-3.5" aria-hidden />
        Report
      </Button>
      <IconButton
        type="button"
        size="small"
        variant="ghost"
        aria-label="Dismiss"
        onClick={dismiss}
      >
        <X className="size-4" aria-hidden />
      </IconButton>
    </div>
  )
}
