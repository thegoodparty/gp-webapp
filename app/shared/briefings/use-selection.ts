'use client'

import { useEffect, useState } from 'react'
import { resolveSelection, type ResolvedAnchor } from './anchorResolver'

/**
 * Hook that watches the document selection and resolves it into a briefing
 * anchor when the user highlights text inside an element carrying
 * `data-anchor-json-path`.
 *
 * Returns the resolved anchor, or null if there is no valid selection.
 *
 * Note on iOS Safari's selection menu: there's no DOM API to suppress
 * the post-selection edit menu while keeping the native drag handles
 * working — both are tied to the live Selection. We accept that the
 * iOS menu may appear alongside our HighlightToolbar; the trade-off is
 * preserving the native drag-to-extend gesture that users expect.
 */
export function useSelection(): ResolvedAnchor | null {
  const [anchor, setAnchor] = useState<ResolvedAnchor | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    function update() {
      const sel = window.getSelection()
      setAnchor(resolveSelection(sel))
    }

    document.addEventListener('selectionchange', update)
    document.addEventListener('mouseup', update)
    document.addEventListener('keyup', update)
    return () => {
      document.removeEventListener('selectionchange', update)
      document.removeEventListener('mouseup', update)
      document.removeEventListener('keyup', update)
    }
  }, [])

  return anchor
}
