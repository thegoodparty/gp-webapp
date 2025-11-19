'use client'
import { useContext } from 'react'
import { ViewModeContext } from './ViewModeProvider'

type ViewMode = 'list' | 'board'

export const useViewMode = (): [ViewMode, (mode: ViewMode) => void] => {
  const context = useContext(ViewModeContext)
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider')
  }

  return context
}

