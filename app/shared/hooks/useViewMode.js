'use client'
import { useContext } from 'react'
import { ViewModeContext } from './ViewModeProvider'

export const useViewMode = () => {
  const context = useContext(ViewModeContext)
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider')
  }

  const [viewMode, setViewMode] = context

  return {
    viewMode,
    setViewMode,
  }
}
