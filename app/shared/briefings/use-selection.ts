'use client'

import { useEffect, useState } from 'react'
import { resolveSelection, type ResolvedAnchor } from './anchorResolver'

// On touch devices, iOS shows its "edit menu" (Copy / Look Up / Share /
// etc.) any time the document carries a non-empty selection. Suppressing
// the long-press callout via `-webkit-touch-callout: none` doesn't help
// here — that property only covers the long-press fallback, not the
// menu that follows a drag-select. The only reliable way to dismiss it
// while preserving our own HighlightToolbar is to capture the anchor
// state from the selection, then clear the OS selection programmatically.
//
// `pendingClearUntil` is a short timestamp window during which we ignore
// the resulting `selectionchange(null)` events so our captured anchor
// survives. The window is intentionally short — long enough to absorb
// browser-level event jitter, short enough that a follow-up user action
// (new selection, dismiss) isn't suppressed.
const PROGRAMMATIC_CLEAR_WINDOW_MS = 200

/**
 * Hook that watches the document selection and resolves it into a
 * briefing anchor when the user highlights text inside an element
 * carrying `data-briefing-json-path`.
 *
 * On touch devices the hook also clears the native selection right
 * after capturing the anchor — that's what suppresses the iOS edit
 * menu. The toolbar continues to render because the captured anchor is
 * held in React state, independent of the live `Selection` object.
 *
 * The X dismiss in HighlightToolbar must call into here to actually
 * reset state, not just `removeAllRanges()` — see the dispatched
 * `selectionchange` event in HighlightToolbar.dismiss for the wire-up.
 */
export function useSelection(): ResolvedAnchor | null {
  const [anchor, setAnchor] = useState<ResolvedAnchor | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let pendingClearUntil = 0

    function update() {
      // While we're inside the programmatic-clear window, ignore any
      // `selectionchange(null)` echoes. The captured anchor must
      // survive so the HighlightToolbar stays mounted.
      if (Date.now() < pendingClearUntil) return
      const sel = window.getSelection()
      setAnchor(resolveSelection(sel))
    }

    function captureAndClearForTouch() {
      const sel = window.getSelection()
      const next = resolveSelection(sel)
      if (!next) return
      setAnchor(next)
      pendingClearUntil = Date.now() + PROGRAMMATIC_CLEAR_WINDOW_MS
      sel?.removeAllRanges()
    }

    document.addEventListener('selectionchange', update)
    document.addEventListener('mouseup', update)
    document.addEventListener('keyup', update)
    // Touch-only path: after the gesture lifts, capture the anchor and
    // wipe the OS selection. Desktop keeps the legacy mouseup path so
    // dragging to read/measure still leaves the selection visible.
    document.addEventListener('touchend', captureAndClearForTouch)
    return () => {
      document.removeEventListener('selectionchange', update)
      document.removeEventListener('mouseup', update)
      document.removeEventListener('keyup', update)
      document.removeEventListener('touchend', captureAndClearForTouch)
    }
  }, [])

  return anchor
}
