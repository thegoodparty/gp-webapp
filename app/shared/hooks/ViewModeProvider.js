'use client'
import { createContext, useState } from 'react'

export const ViewModeContext = createContext([])

export function ViewModeProvider({ children }) {
  const [viewMode, setViewMode] = useState('list')

  const contextValue = [viewMode, setViewMode]

  return (
    <ViewModeContext.Provider value={contextValue}>
      {children}
    </ViewModeContext.Provider>
  )
}
