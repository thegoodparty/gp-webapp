'use client'

import { createContext, useContext } from 'react'
import { PollIssue } from '../poll-types'

export const IssuesContext = createContext<PollIssue[]>([])

export const useIssues = () => useContext(IssuesContext)

interface IssuesProviderProps {
  children: React.ReactNode
  issues: PollIssue[]
}

export const IssuesProvider = ({
  children,
  issues,
}: IssuesProviderProps): React.JSX.Element => {
  return (
    <IssuesContext.Provider value={issues}>{children}</IssuesContext.Provider>
  )
}
