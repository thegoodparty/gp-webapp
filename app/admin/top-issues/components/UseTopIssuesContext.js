import React, { createContext, useContext, useState } from 'react'

const TopIssuesContext = createContext()

export function TopIssuesProvider({ children, initTopIssues }) {
  const state = useState(initTopIssues)

  return (
    <TopIssuesContext.Provider value={state}>
      {children}
    </TopIssuesContext.Provider>
  )
}

export function useTopIssues() {
  const context = useContext(TopIssuesContext)

  if (!context) {
    throw new Error('useTopIssues must be used within a TopIssuesProvider')
  }

  return context
}
