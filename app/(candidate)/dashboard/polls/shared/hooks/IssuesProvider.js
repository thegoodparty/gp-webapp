'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export const IssuesContext = createContext({
  issues: [],
  setIssue: () => {},
})

export const useIssues = () => useContext(IssuesContext)

export const IssuesProvider = ({ children, issues: initIssues = [] }) => {
  const [issues, setIssues] = useState(initIssues)

  useEffect(() => {
    setIssues(initIssues)
  }, [initIssues])

  return (
    <IssuesContext.Provider value={[issues, setIssues]}>
      {children}
    </IssuesContext.Provider>
  )
}
