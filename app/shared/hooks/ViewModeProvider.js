'use client'
import { VIEW_MODES } from 'app/(candidate)/dashboard/issues/shared/constants'
import { createContext, useState } from 'react'

export const ViewModeContext = createContext([])

export function ViewModeProvider({ children }) {
  const [viewMode, setViewMode] = useState(VIEW_MODES.LIST)

  const contextValue = [viewMode, setViewMode]

  return (
    <ViewModeContext.Provider value={contextValue}>
      {children}
    </ViewModeContext.Provider>
  )
}
