'use client'
import { useEffect } from 'react'

export const useClearSelectionOnOpen = (open: boolean): void => {
  useEffect(() => {
    if (!open || typeof window === 'undefined') return
    window.getSelection()?.removeAllRanges()
  }, [open])
}
