'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export const IssueContext = createContext({
  issue: {},
  setIssue: () => {},
})

export const useIssue = () => useContext(IssueContext)

export const IssueProvider = ({ children, issue: initIssue }) => {
  const [issue, setIssue] = useState(initIssue)

  useEffect(() => {
    setIssue(initIssue)
  }, [initIssue])

  return (
    <IssueContext.Provider value={[issue, setIssue]}>
      {children}
    </IssueContext.Provider>
  )
}
