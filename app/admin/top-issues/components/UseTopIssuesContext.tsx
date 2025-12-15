import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react'

interface TopIssue {
  id: number
  name: string
  positions?: { id: number; name: string }[]
}

type TopIssuesState = [TopIssue[], Dispatch<SetStateAction<TopIssue[]>>]

const TopIssuesContext = createContext<TopIssuesState | null>(null)

interface TopIssuesProviderProps {
  children: React.ReactNode
  initTopIssues: TopIssue[]
}

export function TopIssuesProvider({
  children,
  initTopIssues,
}: TopIssuesProviderProps): React.JSX.Element {
  const state = useState(initTopIssues)

  return (
    <TopIssuesContext.Provider value={state}>
      {children}
    </TopIssuesContext.Provider>
  )
}

export function useTopIssues(): TopIssuesState {
  const context = useContext(TopIssuesContext)

  if (!context) {
    throw new Error('useTopIssues must be used within a TopIssuesProvider')
  }

  return context
}
