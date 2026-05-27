'use client'

import { useEffect, useState } from 'react'
import { resolveSelection, type ResolvedAnchor } from './anchorResolver'

// iOS Safari shows its system edit menu (Copy / Look Up / Share / etc.)
// as long as the document carries a non-empty selection. `-webkit-touch
// -callout: none` only blocks the long-press callout fallback, not the
// post-selection menu; clearing the selection on `touchend` is too late
// because iOS shows the menu as soon as the first `selectionchange`
// event lands. The only reliable way to keep the menu suppressed while
// still acting on the user's selection is to capture the anchor into
// React state on the very first `selectionchange` and clear the native
// selection in the same tick. iOS never gets a window where it could
// render its menu.
//
// Side effect: the user can't drag iOS's selection handles to extend the
// initial word, because the native selection is gone immediately. They
// must re-select to pick a different range — an acceptable trade-off
// for an exclusive briefing toolbar on touch devices.
const PROGRAMMATIC_CLEAR_WINDOW_MS = 200

/**
 * Hook that watches the document selection and resolves it into a
 * briefing anchor when the user highlights text inside an element
 * carrying `data-briefing-json-path`.
 *
 * Two paths, branched on the device's input primary:
 *   - Touch (hover:none + pointer:coarse): capture-and-clear on every
 *     `selectionchange`. The captured anchor stays in React state so
 *     the HighlightToolbar still renders; iOS never has a live
 *     selection long enough to show its system menu.
 *   - Mouse/desktop: legacy behavior — track the live selection via
 *     `selectionchange` / `mouseup` / `keyup`. The visible OS selection
 *     stays (useful for drag-to-read), and the system context menu on
 *     right-click is suppressed elsewhere via a contextmenu listener.
 *
 * The X dismiss in HighlightToolbar must dispatch a synthetic
 * `selectionchange` event so this hook drops state when the native
 * selection is already empty (which it is, post-capture on touch).
 */
export function useSelection(): ResolvedAnchor | null {
  const [anchor, setAnchor] = useState<ResolvedAnchor | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const isTouchPrimary = window.matchMedia(
      '(hover: none) and (pointer: coarse)',
    ).matches
    let pendingClearUntil = 0

    function update() {
      // While inside the programmatic-clear window, ignore `selection
      // change(null)` echoes from our own `removeAllRanges` call. The
      // captured anchor must survive so the HighlightToolbar stays.
      if (Date.now() < pendingClearUntil) return
      const sel = window.getSelection()
      setAnchor(resolveSelection(sel))
    }

    function captureAndClear() {
      const sel = window.getSelection()
      const next = resolveSelection(sel)
      if (!next) return
      setAnchor(next)
      pendingClearUntil = Date.now() + PROGRAMMATIC_CLEAR_WINDOW_MS
      sel?.removeAllRanges()
    }

    if (isTouchPrimary) {
      // Order matters: the eager capture-and-clear runs first, then the
      // suppression window blocks the `update` echo. addEventListener
      // dispatches in registration order, so we register the capturer
      // before the consumer.
      document.addEventListener('selectionchange', captureAndClear)
      document.addEventListener('selectionchange', update)
    } else {
      document.addEventListener('selectionchange', update)
      document.addEventListener('mouseup', update)
      document.addEventListener('keyup', update)
    }
    return () => {
      document.removeEventListener('selectionchange', captureAndClear)
      document.removeEventListener('selectionchange', update)
      document.removeEventListener('mouseup', update)
      document.removeEventListener('keyup', update)
    }
  }, [])

  return anchor
}
