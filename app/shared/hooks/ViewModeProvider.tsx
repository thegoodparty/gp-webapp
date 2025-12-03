'use client'
import React, { ReactNode, createContext, useState } from 'react'
import { VIEW_MODES } from 'app/(candidate)/dashboard/issues/shared/constants'

type ViewMode = 'list' | 'board'

export const ViewModeContext = createContext<[ViewMode, (mode: ViewMode) => void] | null>(null)

interface ViewModeProviderProps {
  children: ReactNode
}

export const ViewModeProvider = ({ children }: ViewModeProviderProps): React.JSX.Element => {
  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.LIST)

  const contextValue: [ViewMode, (mode: ViewMode) => void] = [viewMode, setViewMode]

  return (
    <ViewModeContext.Provider value={contextValue}>
      {children}
    </ViewModeContext.Provider>
  )
}

