'use client'

import { useEffect, useState } from 'react'
import { resolveSelection, type ResolvedAnchor } from './anchorResolver'

/**
 * Hook that watches the document selection and resolves it into a briefing
 * anchor when the user highlights text inside an element carrying
 * `data-briefing-json-path`.
 *
 * Returns the resolved anchor, or null if there is no valid selection.
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
